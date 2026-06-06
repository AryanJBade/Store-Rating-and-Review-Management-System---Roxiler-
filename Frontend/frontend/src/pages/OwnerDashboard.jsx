import { useEffect, useState } from "react";
import API from "../services/api";

function OwnerDashboard() {

    const [storeData, setStoreData] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchRatings();
    }, []);

    const fetchDashboard = async () => {
        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                "/store/owner/dashboard",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            console.log("OWNER DASHBOARD:", res.data);

            setStoreData(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (error) {
            console.log(error);
        }
    };

    const fetchRatings = async () => {
        try {

            const token =
                localStorage.getItem("token");

            const res = await API.get(
                "/store/owner/ratings",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            console.log("OWNER RATINGS:", res.data);

            setRatings(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="container mt-5">

            <div className="d-flex justify-content-between mb-4">
                <h2>Store Owner Dashboard</h2>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <div className="alert alert-info">
                Total Stores: {storeData.length}
            </div>

            {storeData.length === 0 ? (
                <div className="alert alert-warning">
                    No Stores Found For This Owner
                </div>
            ) : (
                storeData.map((store) => (
                    <div
                        key={store.store_id}
                        className="card p-3 mb-3"
                    >
                        <h4>
                            Store ID:
                            {" "}
                            {store.store_id}
                        </h4>

                        <h5>
                            Store Name:
                            {" "}
                            {store.store_name}
                        </h5>

                        <h5>
                            Average Rating:
                            {" "}
                            {store.average_rating || 0}
                        </h5>
                    </div>
                ))
            )}

            <h3 className="mt-4">
                Users Who Rated
            </h3>

            <table className="table table-bordered mt-3">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                    </tr>
                </thead>

                <tbody>

                    {ratings.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.rating}</td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default OwnerDashboard;