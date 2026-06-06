const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    dashboard,
    createUser,
    getAllUsers,
    getAllStores,
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    verifyToken,
    isAdmin,
    dashboard
);
router.post(
    "/create-user",
    verifyToken,
    isAdmin,
    createUser
);
router.get(
    "/users",
    verifyToken,
    isAdmin,
    getAllUsers
);
router.get(
    "/stores",
    verifyToken,
    isAdmin,
    getAllStores
);

module.exports = router;