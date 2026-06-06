import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            if (res.data.user.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else if (
                res.data.user.role === "STORE_OWNER"
            ) {
                navigate("/owner-dashboard");
            } else {
                navigate("/stores");
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div className="container mt-5">
            <div
                className="card p-4 mx-auto"
                style={{ maxWidth: "500px" }}
            >
                <h2 className="text-center mb-4">
                    Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-3 text-center">
                    Don't have an account?
                    <Link to="/signup">
                        {" "}
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;