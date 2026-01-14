const express = require("express");
const { getAllCustomer, updateCustomer } = require('../controllers/customer-controller');
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");
const customerRouter = express.Router();

customerRouter.get("/customer", verifyRoles(ROLES_LIST.CUSTOMER), getAllCustomer);
customerRouter.put("/profile",  verifyRoles(ROLES_LIST.CUSTOMER), updateCustomer);

module.exports =  customerRouter;
