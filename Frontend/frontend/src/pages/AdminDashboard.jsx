import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                "/admin/dashboard",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setStats(res.data);

        } catch (error) {
            console.log(error);
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

        try {

            const token =
                localStorage.getItem("token");

            await API.post(
                "/admin/create-user",
                userData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            alert("User Created Successfully");

            setUserData({
                name: "",
                email: "",
                password: "",
                address: "",
                role: "USER",
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Error Creating User"
            );
        }
    };

    const createStore = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            await API.post(
                "/store/create",
                storeData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            alert("Store Created Successfully");

            setStoreData({
                name: "",
                email: "",
                address: "",
                owner_id: "",
            });

            fetchDashboard();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Error Creating Store"
            );
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between mb-4">
                <h2>Admin Dashboard</h2>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <div className="row mb-5">

                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Total Users</h4>
                        <h1>{stats.totalUsers}</h1>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Total Stores</h4>
                        <h1>{stats.totalStores}</h1>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Total Ratings</h4>
                        <h1>{stats.totalRatings}</h1>
                    </div>
                </div>

            </div>

            <div className="card p-4">

                <h3 className="mb-3">
                    Add New Store
                </h3>

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

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Create Store
                    </button>

                </form>

            </div>
            <div className="card p-4 mt-4">

                <h3 className="mb-3">
                    Create User
                </h3>

                <form onSubmit={createUser}>

                    <input
                        type="text"
                        name="name"
                        className="form-control mb-3"
                        placeholder="Full Name"
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
                        type="password"
                        name="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        value={userData.password}
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

                    <select
                        name="role"
                        className="form-control mb-3"
                        value={userData.role}
                        onChange={handleUserChange}
                    >
                        <option value="USER">USER</option>
                        <option value="STORE_OWNER">
                            STORE OWNER
                        </option>
                        <option value="ADMIN">
                            ADMIN
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Create User
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminDashboard;