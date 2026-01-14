const { sequelize, User, Customer } = require("../models");

const getAllCustomer = async (req, res) => {
     return res.status(201).json({
        "message" : "Customer return"     
    });
}

const updateCustomer = async (req, res) => {
  try {
    const userId = req.body.userId; 

    const {
      cus_full_name,
      cus_email,
      cus_phone,
      cus_address,
      image_path,
    } = req.body;

    const customer = await Customer.findOne({
      where: { userId },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update({
      cus_full_name,
      cus_email,
      cus_phone,
      cus_address,
      image_path,
    });

    return res.status(200).json(customer);
  } catch (error) {
    console.error("Update customer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllCustomer, updateCustomer };