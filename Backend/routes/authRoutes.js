const express = require("express");
const router = express.Router();
const {
    signup,
    login,
    changePassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
const verifyToken =
    require("../middleware/authMiddleware");
router.put(
    "/change-password",
    verifyToken,
    changePassword
);

module.exports = router;