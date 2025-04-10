import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import "./Navigation.css";

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navLinks, setNavLinks] = useState<React.ReactNode>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        const userRole = userData?.role;

        if (userRole === "coach") {
          setNavLinks(
            <>
              <Link
                to="/coach"
                className={`nav-link ${isActive("/coach") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/coach/clients"
                className={`nav-link ${
                  isActive("/coach/clients") ? "active" : ""
                }`}
              >
                Clients
              </Link>
              <Link
                to="/coach/plans"
                className={`nav-link ${
                  isActive("/coach/plans") ? "active" : ""
                }`}
              >
                Plans
              </Link>
              <Link
                to="/coach/chat"
                className={`nav-link ${
                  isActive("/coach/chat") ? "active" : ""
                }`}
              >
                Chat
              </Link>
              <Link
                to="/coach/profile"
                className={`nav-link ${
                  isActive("/coach/profile") ? "active" : ""
                }`}
              >
                Profile
              </Link>
            </>
          );
        } else if (userRole === "client") {
          setNavLinks(
            <>
              <Link
                to="/client"
                className={`nav-link ${isActive("/client") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/client/plans"
                className={`nav-link ${
                  isActive("/client/plans") ? "active" : ""
                }`}
              >
                My Plans
              </Link>
              <Link
                to="/client/chat"
                className={`nav-link ${
                  isActive("/client/chat") ? "active" : ""
                }`}
              >
                Chat
              </Link>
              <Link
                to="/client/profile"
                className={`nav-link ${
                  isActive("/client/profile") ? "active" : ""
                }`}
              >
                Profile
              </Link>
            </>
          );
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [currentUser, location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">MD Fitness</Link>
      </div>
      <div className="nav-links">{navLinks}</div>
      <div className="nav-auth">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
