import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Verify() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(
                    "https://pdf-generator-t21m.onrender.com/api/user/verify",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await res.json();

                if (data.success) {
                    alert("Email Verified ✅");
                    navigate("/login");
                } else {
                    alert("Verification Failed ❌");
                }

            } catch (err) {
                alert("Server error ❌");
            }
        };

        if (token) verifyUser();

    }, [token, navigate]);

    return <h1>Verifying...</h1>;
}