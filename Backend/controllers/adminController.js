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
        id,
        name,
        email,
        address,
        role
        FROM users
        ORDER BY name ASC
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
        id,
        name,
        email,
        address,
        owner_id
        FROM stores
        ORDER BY name ASC
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