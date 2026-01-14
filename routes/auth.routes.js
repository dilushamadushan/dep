const express = require("express");
const { register, login, refresh, logout, me } = require("../controllers/auth-controllers");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");
const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get('/auth/refresh', refresh);
router.post("/auth/logout", logout);
router.get("/auth/me",verifyJwt,verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.CUSTOMER), me);

module.exports = router;

