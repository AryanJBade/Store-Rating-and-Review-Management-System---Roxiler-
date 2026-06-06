const db = require("../config/db");

const submitRating = (req, res) => {
    const { store_id, rating } = req.body;

    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5",
        });
    }

    db.query(
        "SELECT * FROM ratings WHERE user_id=? AND store_id=?",
        [user_id, store_id],
        (err, result) => {

            if (result.length > 0) {

                db.query(
                    "UPDATE ratings SET rating=? WHERE user_id=? AND store_id=?",
                    [rating, user_id, store_id],
                    (err) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        return res.json({
                            message: "Rating Updated Successfully",
                        });
                    }
                );

            } else {

                db.query(
                    "INSERT INTO ratings(user_id,store_id,rating) VALUES(?,?,?)",
                    [user_id, store_id, rating],
                    (err) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        return res.json({
                            message: "Rating Submitted Successfully",
                        });
                    }
                );

            }
        }
    );
};

module.exports = {
    submitRating,
};