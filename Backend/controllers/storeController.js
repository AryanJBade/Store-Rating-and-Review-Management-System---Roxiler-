const db = require("../config/db");

const createStore = (req, res) => {
    const { name, email, address, owner_id } = req.body;
    const requestingUser = req.user;

    // Validate name length
    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({
            message: "Store name must be between 20 and 60 characters",
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

    let resolvedOwnerId = requestingUser.role === "STORE_OWNER" ? requestingUser.id : owner_id;

    if (!name || !email || !address || !resolvedOwnerId) {
        return res.status(400).json({
            message: "Store name, email, address, and owner_id are required",
        });
    }

    db.query(
        "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
        [name, email, address, resolvedOwnerId],
        (err) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Store Created Successfully",
            });
        }
    );
};

const getAllStores = (req, res) => {
    const userId = req.user.id;

    db.query(
        `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating),1) AS average_rating,
      (
        SELECT rating
        FROM ratings
        WHERE user_id = ?
          AND store_id = s.id
        LIMIT 1
      ) AS user_rating
    FROM stores s
    LEFT JOIN ratings r
    ON s.id = r.store_id
    GROUP BY s.id, s.name, s.email, s.address
    `,
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json(result);
        }
    );
};
const ownerDashboard = (req, res) => {
    const ownerId = req.user.id;

    const query = `
    SELECT 
      s.id as store_id,
      s.name as store_name,
      ROUND(AVG(r.rating),1) as average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id
  `;

    db.query(query, [ownerId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};
const usersWhoRated = (req, res) => {
    const ownerId = req.user.id;

    const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      r.rating,
      s.name as store_name
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    JOIN stores s ON r.store_id = s.id
    WHERE s.owner_id = ?
  `;

    db.query(query, [ownerId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

module.exports = {
    createStore,
    getAllStores,
    ownerDashboard,
    usersWhoRated,
};