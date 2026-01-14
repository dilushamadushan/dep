const { sequelize, User, Customer } = require("../models");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

async function hashPassword(plainText) {
  return await bcrypt.hash(plainText, 12);
}

const me = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {username : req.user},
      attributes: ['userId', "username", "role"],
      include:[{
        model: Customer,
        as: 'customer',
        attributes: [
          'cus_full_name',
          'cus_email',
          'cus_phone',
          'cus_address',
          'image_path',
        ],
      },
    ],
    });
    if(!user) return res.sendStatus(404);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message : "Internal server error",
      error : error.message,
    })
  }
}

const register = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();
    const user = await User.create(
      {
        username: req.body.username,
        password: await hashPassword(req.body.password),
        role: "CUSTOMER",
        customer: {
          cus_full_name: req.body.cus_full_name,
          cus_email: req.body.cus_email,
          cus_phone: req.body.cus_phone,
          cus_address: req.body.cus_address,
          image_path: req.body.image_path,
        },
      },
      {
        include: [{ model: Customer, as: "customer" }],
        transaction,
      }
    );

    await transaction.commit();
    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Username already exists" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      message: "Username and password required.",
    });

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid usename or password.",
      });
    }

    const accessToken = jwt.sign(
      {
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "59s" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.token = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const refresh = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401);
  const refreshToken = cookie.jwt;
  try {
    const user = await User.findOne({
      where: { token: refreshToken },
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.username !== decoded.username)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            username: decoded.username,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "59s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  const cookie = req.cookies;
  
  if (!cookie?.jwt) return res.sendStatus(204);
  const refreshToken = cookie.jwt;
  const user = await User.findOne({
    where: { token: refreshToken },
  });

  if (user) {
    user.token = null;
    await user.save();
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.sendStatus(204);
};

module.exports = { register, login, refresh, logout, me };
