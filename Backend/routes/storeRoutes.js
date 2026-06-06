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

router.post(
    "/create",
    verifyToken,
    isAdmin,
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