const express = require("express");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");
const { getAllCustomer, deleteCustomer } = require("../controllers/admin-controller");
const adminRouter = express.Router();

adminRouter.get("/admin/customers", verifyRoles(ROLES_LIST.ADMIN), getAllCustomer);
adminRouter.delete("/admin/customers/:userId", verifyRoles(ROLES_LIST.ADMIN),deleteCustomer);
module.exports =  adminRouter;
