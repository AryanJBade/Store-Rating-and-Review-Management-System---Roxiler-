const db = require("../config/db");

const dashboard = (req, res) => {
    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, users) => {
            if (err) return res.status(500).json(err);

            db.query(
                "SELECT COUNT(*) AS totalStores FROM stores",
                (err, stores) => {
                    if (err) return res.status(500).json(err);

                    db.query(
                        "SELECT COUNT(*) AS totalRatings FROM ratings",
                        (err, ratings) => {
                            if (err) return res.status(500).json(err);

                            res.json({
                                totalUsers: users[0].totalUsers,
                                totalStores: stores[0].totalStores,
                                totalRatings: ratings[0].totalRatings,
                            });
                        }
                    );
                }
            );
        }
    );
};
const bcrypt = require("bcryptjs");


const createUser = async (req, res) => {
    console.log("BODY =", req.body);

    try {
        const { name, email, password, address, role } = req.body;

        // Validate name length
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({
                message: "Name must be between 20 and 60 characters",
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        // Validate address length
        if (address && address.length > 400) {
            return res.status(400).json({
                message: "Address cannot exceed 400 characters",
            });
        }

        // Validate password format
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)",
            [name, email, hashedPassword, address, role],
            (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "User Created Successfully",
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};
const getAllUsers = (req, res) => {
    db.query(
        `
        SELECT
          u.id,
          u.name,
          u.email,
          u.address,
          u.role,
          IFNULL(ROUND(AVG(r.rating),1), 0) AS rating
        FROM users u
        LEFT JOIN stores s ON u.id = s.owner_id
        LEFT JOIN ratings r ON s.id = r.store_id
        GROUP BY u.id, u.name, u.email, u.address, u.role
        ORDER BY u.name ASC
        `,
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};
const getAllStores = (req, res) => {
    db.query(
        `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id,
          u.name AS owner_name,
          IFNULL(ROUND(AVG(r.rating),1), 0) AS average_rating
        FROM stores s
        LEFT JOIN users u ON s.owner_id = u.id
        LEFT JOIN ratings r ON s.id = r.store_id
        GROUP BY s.id, s.name, s.email, s.address, s.owner_id, u.name
        ORDER BY s.name ASC
        `,
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
};
module.exports = {
    dashboard,
    createUser,
    getAllUsers,
    getAllStores,
};