import { useEffect, useState } from "react";
import API from "../services/api";

function StoreList() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [ratingValue, setRatingValue] = useState("");
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("success");

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/store/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStores(res.data || []);
        } catch (error) {
            console.log(error);
            setNotificationType("danger");
            setNotification(error.response?.data?.message || "Unable to fetch stores");
            setTimeout(() => setNotification(""), 5000);
        }
    };

    const openRatingModal = (storeId, currentRating) => {
        setSelectedStoreId(storeId);
        setRatingValue(currentRating || "");
    };

    const submitRating = async (e) => {
        e.preventDefault();

        if (!ratingValue || Number(ratingValue) < 1 || Number(ratingValue) > 5) {
            setNotificationType("danger");
            setNotification("Rating must be between 1 and 5");
            setTimeout(() => setNotification(""), 5000);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await API.post(
                "/rating/submit",
                {
                    store_id: selectedStoreId,
                    rating: Number(ratingValue),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotificationType("success");
            setNotification("Rating saved successfully");
            setTimeout(() => setNotification(""), 5000);
            setSelectedStoreId(null);
            setRatingValue("");
            fetchStores();
        } catch (error) {
            console.log(error);
            setNotificationType("danger");
            setNotification(error.response?.data?.message || "Unable to save rating");
            setTimeout(() => setNotification(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (!passwordRegex.test(passwordForm.newPassword)) {
            setNotificationType("danger");
            setNotification("New password must be 8-16 characters and include at least one uppercase letter and one special character");
            setTimeout(() => setNotification(""), 5000);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await API.put(
                "/auth/change-password",
                {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotificationType("success");
            setNotification("Password updated successfully");
            setTimeout(() => setNotification(""), 5000);
            setPasswordForm({ oldPassword: "", newPassword: "" });
        } catch (error) {
            console.log(error);
            setNotificationType("danger");
            setNotification(error.response?.data?.message || "Unable to update password");
            setTimeout(() => setNotification(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const filteredStores = stores.filter((store) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;

        return (
            store.name?.toLowerCase().includes(keyword) ||
            store.address?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Store Ratings</h2>
                    <p className="text-muted mb-0">
                        Browse stores and submit or modify your ratings.
                    </p>
                </div>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>

            {notification && (
                <div className={`alert alert-${notificationType}`}>
                    {notification}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search stores by name or address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Store Name</th>
                            <th>Address</th>
                            <th>Average Rating</th>
                            <th>Your Rating</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    No stores found.
                                </td>
                            </tr>
                        ) : (
                            filteredStores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.address}</td>
                                    <td>{store.average_rating || 0}</td>
                                    <td>{store.user_rating ?? "-"}</td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => openRatingModal(store.id, store.user_rating)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#ratingModal"
                                        >
                                            {store.user_rating ? "Update Rating" : "Submit Rating"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rating Modal */}
            <div className="modal fade" id="ratingModal" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ratingModalLabel">
                                Submit Rating
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={submitRating}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Rating (1-5)</label>
                                    <select
                                        className="form-select"
                                        value={ratingValue}
                                        onChange={(e) => setRatingValue(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a rating</option>
                                        <option value="1">1 - Poor</option>
                                        <option value="2">2 - Fair</option>
                                        <option value="3">3 - Good</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="5">5 - Excellent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Saving..." : "Save Rating"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card p-4 mt-5">
                <h4>Update Password</h4>
                <p className="text-muted">Change your user password.</p>
                <form onSubmit={handlePasswordChange}>
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Current Password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StoreList;
