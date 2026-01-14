const { Customer, User, sequelize } = require("../models");

const getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.findAll();

    return res.status(200).json({
      message: "Customers fetched successfully",
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Get all customers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCustomer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.params; 

    const customer = await Customer.findOne({ where: { userId }, transaction });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    await User.destroy({ where: { userId: userId }, transaction });

    await Customer.destroy({ where: { userId }, transaction });

    await transaction.commit();

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete customer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllCustomer, deleteCustomer };