import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Signup = ({ onClose }) => {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState({
    isValid: false,
    errors: {
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecial: false,
    },
    priorityError: "",
  });
  const [mobileValidation, setMobileValidation] = useState({
    isValid: true,
    error: "",
  });

  // Validation function
  function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password); // At least one lowercase letter
    const hasUppercase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasNumber = /[0-9]/.test(password); // At least one number
    const hasSpecial = /[!@#$%^&*]/.test(password); // At least one special character

    const isValid = minLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;

    return {
      isValid,
      errors: {
        minLength: !minLength,
        hasLowercase: !hasLowercase,
        hasUppercase: !hasUppercase,
        hasNumber: !hasNumber,
        hasSpecial: !hasSpecial,
      },
    };
  }

  function validateMobileNumber(mobile) {
    const isValid = /^\d{10}$/.test(mobile); // Exactly 10 digits
    return {
      isValid,
      error: !isValid ? "Mobile number must be exactly 10 digits" : "",
    };
  }

  // Determine priority error
  function getPriorityError(errors) {
    if (errors.minLength) return "Length must be at least 8 characters";
    if (errors.hasSpecial) return "Special character missing (!@#$%^&*)";
    if (errors.hasNumber) return "Number missing";
    if (errors.hasUppercase) return "Uppercase missing";
    if (errors.hasLowercase) return "Lowercase missing";
    return "";
  }

  const handlePasswordBlur = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) { // Only validate if there’s input
      const result = validatePassword(newPassword);
      setValidation({ ...result, priorityError: getPriorityError(result.errors) });
    } else {
      setValidation({ isValid: false, errors: { minLength: false, hasLowercase: false, hasUppercase: false, hasNumber: false, hasSpecial: false }, priorityError: "" });
    }
    setConfirmMatch(newPassword === confirmPassword);
  };

  const handleMobileBlur = (e) => {
    const newMobile = e.target.value;
    setMobileNumber(newMobile);
    const result = validateMobileNumber(newMobile);
    setMobileValidation(result);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmMatch(password === newConfirmPassword);
  };

  const [confirmMatch, setConfirmMatch] = useState(true);

  // to ensure confirmMatch is always in sync with password and confirmPassword
  useEffect(() => {
    setConfirmMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fullName, mobileNumber, email, password, role}), // Using fullName as username
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Please log in.");
        setFullName("");
        setMobileNumber("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("user"); // Reset role to default
        setTimeout(() => onClose("login"), 1000); // Auto-switch to login after 1 s
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md border border-gray-200 relative transform transition-all duration-300 ease-in-out">
        <button
          onClick={() => onClose(null)}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold transition-colors"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center text-[#27ae60] mb-5">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-transparent transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="flex gap-3">

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                value={mobileNumber}
                onBlur={handleMobileBlur} // Added blur event
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-transparent transition-all"
                placeholder="e.g., +1234567890"
                required
              />
              {mobileValidation.error && <p className="text-red-500 text-sm mt-1">{mobileValidation.error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-transparent transition-all"
              placeholder="Create a password"
              required
            />
            {validation.priorityError && (
              <p className="text-red-500 text-sm mt-1">{validation.priorityError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27ae60] focus:border-transparent transition-all"
              placeholder="Confirm your password"
              required
            />
            {!confirmMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Are you a Real Estate Agent?</label>
            <div className="flex items-center space-x-6 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yes"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 cursor-pointer accent-[#27ae60] transition-all"
                />
                <label htmlFor="yes" className="text-gray-700">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 cursor-pointer accent-[#27ae60] transition-all"
                />
                <label htmlFor="no" className="text-gray-700">No</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-medium transition-all duration-200 ${
              !(validation.isValid && confirmMatch)
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : "bg-[#27ae60] hover:bg-green-700"
            }`}
            disabled={!validation.isValid || !confirmMatch}
          >
            Register
          </button>

          {message && (
            <p
              className={`text-center mt-3 ${
                message.includes("successful") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onClose("login")}
              className="text-[#27ae60] hover:underline focus:outline-none transition-colors"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;