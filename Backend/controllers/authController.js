const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) return res.status(500).json(err);

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists",
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)",
                    [name, email, hashedPassword, address, "USER"],
                    (err) => {
                        if (err) return res.status(500).json(err);

                        res.status(201).json({
                            message: "User Registered Successfully",
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};

// LOGIN
const login = (req, res) => {
    try {
        const { email, password } = req.body;

        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) return res.status(500).json(err);

                if (result.length === 0) {
                    return res.status(404).json({
                        message: "User not found",
                    });
                }

                const user = result[0];

                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return res.status(401).json({
                        message: "Invalid Password",
                    });
                }

                const token = jwt.sign(
                    {
                        id: user.id,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d",
                    }
                );

                res.status(200).json({
                    message: "Login Successful",
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
        });
    }
};
const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const userId = req.user.id;

    db.query(
        "SELECT * FROM users WHERE id=?",
        [userId],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    oldPassword,
                    user.password
                );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Old Password Incorrect",
                });
            }

            const hashed =
                await bcrypt.hash(
                    newPassword,
                    10
                );

            db.query(
                "UPDATE users SET password=? WHERE id=?",
                [hashed, userId],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message:
                            "Password Updated Successfully",
                    });
                }
            );
        }
    );
};

module.exports = {
    signup,
    login,
    changePassword,
};