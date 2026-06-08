import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });
    const [storeData, setStoreData] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: "",
    });
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
    });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [userFilter, setUserFilter] = useState("");
    const [storeFilter, setStoreFilter] = useState("");
    const [userSort, setUserSort] = useState({ field: "name", direction: "asc" });
    const [storeSort, setStoreSort] = useState({ field: "name", direction: "asc" });

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
        fetchStores();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStats(res.data);
        } catch (error) {
            console.log(error);
            alert("Unable to load admin dashboard");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data || []);
        } catch (error) {
            console.log(error);
            alert("Unable to load users");
        }
    };

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/admin/stores", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStores(res.data || []);
        } catch (error) {
            console.log(error);
            alert("Unable to load stores");
        }
    };

    const handleChange = (e) => {
        setStoreData({
            ...storeData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUserChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const createUser = async (e) => {
        e.preventDefault();

        // Name Validation
        if (userData.name.length < 20 || userData.name.length > 60) {
            return alert("Name must be between 20 and 60 characters");
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return alert("Please enter a valid email address");
        }

        // Address Validation
        if (userData.address.length > 400) {
            return alert("Address cannot exceed 400 characters");
        }

        // Password Validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
        if (!passwordRegex.test(userData.password)) {
            return alert("Password must be 8-16 characters and contain at least one uppercase letter and one special character");
        }

        try {
            const token = localStorage.getItem("token");
            await API.post("/admin/create-user", userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("User created successfully");
            setUserData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER",
            });
            fetchUsers();
            fetchDashboard();
        } catch (error) {
            alert(error.response?.data?.message || "Error creating user");
        }
    };

    const createStore = async (e) => {
        e.preventDefault();

        // Name Validation
        if (storeData.name.length < 20 || storeData.name.length > 60) {
            return alert("Store name must be between 20 and 60 characters");
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(storeData.email)) {
            return alert("Please enter a valid email address");
        }

        // Address Validation
        if (storeData.address.length > 400) {
            return alert("Address cannot exceed 400 characters");
        }

        // Owner ID Validation
        if (!storeData.owner_id || isNaN(storeData.owner_id)) {
            return alert("Please enter a valid owner ID");
        }

        try {
            const token = localStorage.getItem("token");
            await API.post("/store/create", storeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Store created successfully");
            setStoreData({
                name: "",
                email: "",
                address: "",
                owner_id: "",
            });
            fetchStores();
            fetchDashboard();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error creating store");
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const sortRows = (list, config) => {
        return [...list].sort((a, b) => {
            const aValue = a[config.field] ?? "";
            const bValue = b[config.field] ?? "";
            const direction = config.direction === "asc" ? 1 : -1;

            if (typeof aValue === "number" && typeof bValue === "number") {
                return (aValue - bValue) * direction;
            }

            return aValue.toString().localeCompare(bValue.toString(), undefined, {
                sensitivity: "base",
            }) * direction;
        });
    };

    const toggleUserSort = (field) => {
        setUserSort((current) => ({
            field,
            direction:
                current.field === field && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const toggleStoreSort = (field) => {
        setStoreSort((current) => ({
            field,
            direction:
                current.field === field && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const filteredUsers = useMemo(() => {
        const keyword = userFilter.trim().toLowerCase();
        return users.filter((user) => {
            if (!keyword) return true;
            return (
                user.name.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.address.toLowerCase().includes(keyword) ||
                user.role.toLowerCase().includes(keyword)
            );
        });
    }, [users, userFilter]);

    const filteredStores = useMemo(() => {
        const keyword = storeFilter.trim().toLowerCase();
        return stores.filter((store) => {
            if (!keyword) return true;
            return (
                store.name.toLowerCase().includes(keyword) ||
                store.email.toLowerCase().includes(keyword) ||
                store.address.toLowerCase().includes(keyword)
            );
        });
    }, [stores, storeFilter]);

    const sortedUsers = sortRows(filteredUsers, userSort);
    const sortedStores = sortRows(filteredStores, storeSort);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p className="text-muted mb-0">
                        Manage stores, users, and platform ratings from one place.
                    </p>
                </div>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>

            <div className="row gy-3 mb-5">
                <div className="col-md-4">
                    <div className="card p-4 shadow-sm">
                        <h5>Total Users</h5>
                        <h1>{stats.totalUsers}</h1>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4 shadow-sm">
                        <h5>Total Stores</h5>
                        <h1>{stats.totalStores}</h1>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4 shadow-sm">
                        <h5>Total Ratings</h5>
                        <h1>{stats.totalRatings}</h1>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card p-4">
                        <h4>Add New User</h4>
                        <form onSubmit={createUser}>
                            <input
                                type="text"
                                name="name"
                                className="form-control mb-3"
                                placeholder="Name"
                                value={userData.name}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                className="form-control mb-3"
                                placeholder="Email"
                                value={userData.email}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                className="form-control mb-3"
                                placeholder="Address"
                                value={userData.address}
                                onChange={handleUserChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                className="form-control mb-3"
                                placeholder="Password"
                                value={userData.password}
                                onChange={handleUserChange}
                                required
                            />
                            <select
                                name="role"
                                className="form-select mb-3"
                                value={userData.role}
                                onChange={handleUserChange}
                            >
                                <option value="USER">Normal User</option>
                                <option value="STORE_OWNER">Store Owner</option>
                                <option value="ADMIN">System Administrator</option>
                            </select>
                            <button className="btn btn-primary w-100" type="submit">
                                Create User
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card p-4">
                        <h4>Add New Store</h4>
                        <form onSubmit={createStore}>
                            <input
                                type="text"
                                name="name"
                                className="form-control mb-3"
                                placeholder="Store Name"
                                value={storeData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                className="form-control mb-3"
                                placeholder="Store Email"
                                value={storeData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                className="form-control mb-3"
                                placeholder="Store Address"
                                value={storeData.address}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="owner_id"
                                className="form-control mb-3"
                                placeholder="Store Owner ID"
                                value={storeData.owner_id}
                                onChange={handleChange}
                                required
                            />
                            <button className="btn btn-primary w-100" type="submit">
                                Create Store
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="card p-4 mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4>Users</h4>
                        <p className="text-muted mb-0">
                            Filter and sort registered users by role, address, or name.
                        </p>
                    </div>
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search users"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th role="button" onClick={() => toggleUserSort("name")}>Name</th>
                                <th role="button" onClick={() => toggleUserSort("email")}>Email</th>
                                <th role="button" onClick={() => toggleUserSort("address")}>Address</th>
                                <th role="button" onClick={() => toggleUserSort("role")}>Role</th>
                                <th role="button" onClick={() => toggleUserSort("rating")}>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                    <td>{user.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card p-4 mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4>Stores</h4>
                        <p className="text-muted mb-0">
                            View all stores, owners, and average ratings.
                        </p>
                    </div>
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search stores"
                        value={storeFilter}
                        onChange={(e) => setStoreFilter(e.target.value)}
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th role="button" onClick={() => toggleStoreSort("name")}>Name</th>
                                <th role="button" onClick={() => toggleStoreSort("email")}>Email</th>
                                <th role="button" onClick={() => toggleStoreSort("address")}>Address</th>
                                <th role="button" onClick={() => toggleStoreSort("average_rating")}>Avg Rating</th>
                                <th role="button" onClick={() => toggleStoreSort("owner_name")}>Owner Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.name}</td>
                                    <td>{store.email}</td>
                                    <td>{store.address}</td>
                                    <td>{store.average_rating}</td>
                                    <td>{store.owner_name || "Unknown"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

