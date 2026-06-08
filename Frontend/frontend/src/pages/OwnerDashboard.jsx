import { useEffect, useState } from "react";
import API from "../services/api";

function OwnerDashboard() {
    const [storeData, setStoreData] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
    });
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("success");
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDashboard();
        fetchRatings();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/store/owner/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStoreData(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log(error);
            alert("Unable to load owner dashboard");
        }
    };

    const fetchRatings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/store/owner/ratings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRatings(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log(error);
            alert("Unable to load store rating submissions");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (!passwordRegex.test(passwordForm.newPassword)) {
            return alert(
                "New password must be 8-16 characters and include at least one uppercase letter and one special character"
            );
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
            alert("Password updated successfully");
            setPasswordForm({ oldPassword: "", newPassword: "" });
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Unable to update password");
        } finally {
            setLoading(false);
        }
    };

    const createStore = async (e) => {
        e.preventDefault();

        // Name Validation
        if (storeForm.name.length < 20 || storeForm.name.length > 60) {
            setNotificationType("danger");
            setNotification("Store name must be between 20 and 60 characters");
            setTimeout(() => setNotification(""), 5000);
            return;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(storeForm.email)) {
            setNotificationType("danger");
            setNotification("Please enter a valid email address");
            setTimeout(() => setNotification(""), 5000);
            return;
        }

        // Address Validation
        if (storeForm.address.length > 400) {
            setNotificationType("danger");
            setNotification("Address cannot exceed 400 characters");
            setTimeout(() => setNotification(""), 5000);
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await API.post(
                "/store/create",
                {
                    name: storeForm.name,
                    email: storeForm.email,
                    address: storeForm.address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotificationType("success");
            setNotification("Store created successfully.");
            setStoreForm({ name: "", email: "", address: "" });
            fetchDashboard();
            setTimeout(() => setNotification(""), 5000);
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || "Unable to create store";
            setNotificationType("danger");
            setNotification(message);
            setTimeout(() => setNotification(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleStoreChange = (e) => {
        const { name, value } = e.target;
        setStoreForm({ ...storeForm, [name]: value });
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Store Owner Dashboard</h2>
                    <p className="text-muted mb-0">
                        See your store average rating and the users who rated your store.
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

            <div className="alert alert-info mb-4">
                Total Stores: {storeData.length}
            </div>

            <div className="card p-4 mb-4">
                <h4>Add Store</h4>
                <form onSubmit={createStore}>
                    <input
                        type="text"
                        name="name"
                        className="form-control mb-3"
                        placeholder="Store Name"
                        value={storeForm.name}
                        onChange={handleStoreChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        className="form-control mb-3"
                        placeholder="Store Email"
                        value={storeForm.email}
                        onChange={handleStoreChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        className="form-control mb-3"
                        placeholder="Store Address"
                        value={storeForm.address}
                        onChange={handleStoreChange}
                        required
                    />
                    <button className="btn btn-success" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Store"}
                    </button>
                </form>
            </div>

            {storeData.length === 0 ? (
                <div className="alert alert-warning">
                    No stores found for this owner.
                </div>
            ) : (
                storeData.map((store) => (
                    <div key={store.store_id} className="card p-4 mb-3 shadow-sm">
                        <h4>{store.store_name}</h4>
                        <p className="mb-1">
                            <strong>Store ID:</strong> {store.store_id}
                        </p>
                        <p className="mb-0">
                            <strong>Average Rating:</strong> {store.average_rating || 0}
                        </p>
                    </div>
                ))
            )}

            <div className="card p-4 mt-4">
                <h4>Users Who Rated</h4>
                <div className="table-responsive">
                    <table className="table table-bordered mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Store</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        No ratings submitted yet.
                                    </td>
                                </tr>
                            ) : (
                                ratings.map((user, index) => (
                                    <tr key={`${user.id}-${index}`}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.rating}</td>
                                        <td>{user.store_name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card p-4 mt-5">
                <h4>Update Password</h4>
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

export default OwnerDashboard;
