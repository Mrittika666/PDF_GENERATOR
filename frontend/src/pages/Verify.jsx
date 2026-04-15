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
                console.log("VERIFY RESPONSE:", data);

                if (data.success) {
                    alert("Email Verified ✅");

                    // 👉 1 sec wait then redirect
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);

                } else {
                    alert("Verification Failed ❌");
                }

            } catch (err) {
                console.log("VERIFY ERROR:", err);
                alert("Something went wrong");
            }
        };

        if (token) verifyUser();

    }, [token, navigate]);

    return <h1>Verifying...</h1>;
}