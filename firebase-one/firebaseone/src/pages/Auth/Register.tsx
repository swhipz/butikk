import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import "./Auth.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"client" | "coach">("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      const { user } = await register(email, password);

      // Create user profile with security timestamp
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName,
        role,
        photoURL: "",
        bio: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        ...(role === "coach"
          ? {
              specialties: [],
              experience: "",
              clientCount: 0,
              rating: 0,
              reviewCount: 0,
            }
          : {
              measurements: {
                height: 0,
                weight: 0,
                bodyFat: null,
                lastUpdated: serverTimestamp(),
              },
              goals: [],
              coachId: null,
              currentPlanId: null,
            }),
      });

      // Navigate based on role
      navigate(role === "client" ? "/client" : "/coach");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join us on your fitness journey</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Enter your name"
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "client" | "coach")}
                required
                className="role-select"
              >
                <option value="client">Client</option>
                <option value="coach">Coach</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password (min. 6 characters)"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
