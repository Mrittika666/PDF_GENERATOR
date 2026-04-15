import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Verify() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://pdf-generator-t21m.onrender.com/api/user/verify", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Email Verified ✅");
                    navigate("/login");
                } else {
                    alert("Verification Failed ❌");
                }
            });
    }, []);

    return <h1>Verifying...</h1>;
}