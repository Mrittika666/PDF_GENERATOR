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

                console.log("STATUS:", res.status);

                const text = await res.text();
                console.log("RAW RESPONSE:", text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    alert("Server error ❌");
                    return;
                }

                if (data.success) {
                    alert("Email Verified ✅");
                    navigate("/login");
                } else {
                    alert(data.message || "Verification Failed ❌");
                }

            } catch (err) {
                console.log("VERIFY ERROR:", err);
                alert("Network error ❌");
            }
        };

        if (token) verifyUser();

    }, [token, navigate]);

    return <h1>Verifying...</h1>;
}