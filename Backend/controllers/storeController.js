const db = require("../config/db");

const createStore = (req, res) => {
    const {
        name,
        email,
        address,
        owner_id
    } = req.body;

    db.query(
        "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
        [name, email, address, owner_id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Store Created Successfully"
            });
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
      ROUND(AVG(r.rating),1) AS average_rating
    FROM stores s
    LEFT JOIN ratings r
    ON s.id = r.store_id
    GROUP BY s.id
    `,
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