import React from "react";
import { Link } from "react-router-dom";

const AuthSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">🎉 Success!</h2>
                <p className="text-gray-500 mb-6">Your action was successful. You can now proceed to login.</p>
                <Link to="/login" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500">Go to Login</Link>
            </div>
        </div>
    );
};

export default AuthSuccess;