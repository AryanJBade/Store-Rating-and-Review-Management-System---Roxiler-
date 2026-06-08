const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");


const {
    createStore,
    getAllStores,
    ownerDashboard,
    usersWhoRated,
} = require("../controllers/storeController");

const isOwnerOrAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN" && req.user.role !== "STORE_OWNER") {
        return res.status(403).json({
            message: "Access Denied. Admin or Store Owner only",
        });
    }
    next();
};

router.post(
    "/create",
    verifyToken,
    isOwnerOrAdmin,
    createStore
);
router.get(
    "/all",
    verifyToken,
    getAllStores
);

router.get(
    "/owner/dashboard",
    verifyToken,
    ownerDashboard
);

router.get(
    "/owner/ratings",
    verifyToken,
    usersWhoRated
);

module.exports = router;