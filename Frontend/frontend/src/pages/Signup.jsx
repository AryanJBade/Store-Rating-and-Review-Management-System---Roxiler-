import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
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

        // Name Validation
        if (
            formData.name.length < 20 ||
            formData.name.length > 60
        ) {
            return alert(
                "Name must be between 20 and 60 characters"
            );
        }

        // Address Validation
        if (
            formData.address.length > 400
        ) {
            return alert(
                "Address cannot exceed 400 characters"
            );
        }

        // Password Validation
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

        if (
            !passwordRegex.test(
                formData.password
            )
        ) {
            return alert(
                "Password must be 8-16 characters and contain at least one uppercase letter and one special character"
            );
        }

        try {

            await API.post(
                "/auth/signup",
                formData
            );

            alert("Signup Successful");

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Signup Failed"
            );
        }
    };

    return (
        <div className="container mt-5">

            <div
                className="card p-4 mx-auto"
                style={{ maxWidth: "600px" }}
            >

                <h2 className="text-center mb-4">
                    Signup
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        className="form-control mb-3"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        className="form-control mb-3"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="address"
                        className="form-control mb-3"
                        placeholder="Address"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="btn btn-success w-100"
                        type="submit"
                    >
                        Signup
                    </button>

                </form>

                <p className="mt-3 text-center">
                    Already have an account?
                    <Link to="/">
                        {" "}Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Signup;