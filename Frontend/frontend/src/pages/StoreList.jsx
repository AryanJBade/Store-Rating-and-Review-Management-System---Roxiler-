import { useEffect, useState } from "react";
import API from "../services/api";

function StoreList() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");

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

            setStores(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const submitRating = async (storeId) => {
        const rating = prompt("Enter Rating (1-5)");

        if (!rating) return;

        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/rating/submit",
                {
                    store_id: storeId,
                    rating: Number(rating),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Rating Submitted Successfully");

            fetchStores();
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
            <div className="d-flex justify-content-between mb-3">
                <h2>All Stores</h2>

                <button
                    className="btn btn-danger"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search Store By Name"
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Store Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Average Rating</th>
                        <th>Submit Rating</th>
                    </tr>
                </thead>

                <tbody>
                    {stores
                        .filter((store) =>
                            store.name
                                .toLowerCase()
                                .includes(
                                    search.toLowerCase()
                                )
                        )
                        .map((store) => (
                            <tr key={store.id}>
                                <td>{store.id}</td>
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address}</td>
                                <td>
                                    {store.average_rating || 0}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            submitRating(
                                                store.id
                                            )
                                        }
                                    >
                                        Rate
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default StoreList;