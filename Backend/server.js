const express = require("express");
const cors = require("cors");
require("dotenv").config();
const storeRoutes = require("./routes/storeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/rating", ratingRoutes);

app.get("/", (req, res) => {
    res.send("Store Rating API Running");
});

const verifyToken = require("./middleware/authMiddleware");

app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Protected Route Accessed",
        user: req.user,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});