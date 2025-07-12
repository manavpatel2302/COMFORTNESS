import React, { useState } from "react";

const Login = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Login successful!");
        onLogin(data.username); // Pass username to parent (Nav.jsx)
        setTimeout(() => onClose(null), 1500); // Close modal after 1.5s
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-200 relative">
        {/* Close Button */}
        <button
          onClick={() => onClose(null)} // Close modal without switching
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center text-[#27ae60] mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor='password' className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60]"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-[#27ae60] hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#27ae60] text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Login
          </button>

          {message && (
            <p
              className={`text-center mt-4 ${
                message.includes("successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-gray-700">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => onClose("signup")}
              className="text-[#27ae60] hover:underline focus:outline-none"
            >
              Signup
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;