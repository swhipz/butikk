import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import "./Navigation.css";

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState<React.ReactNode>(null);

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
              <Link to="/coach" className="nav-link">
                Dashboard
              </Link>
              <Link to="/coach/clients" className="nav-link">
                Clients
              </Link>
              <Link to="/coach/plans" className="nav-link">
                Plans
              </Link>
              <Link to="/coach/chat" className="nav-link">
                Chat
              </Link>
            </>
          );
        } else if (userRole === "client") {
          setNavLinks(
            <>
              <Link to="/client" className="nav-link">
                Dashboard
              </Link>
              <Link to="/client/plans" className="nav-link">
                My Plans
              </Link>
              <Link to="/client/chat" className="nav-link">
                Chat
              </Link>
              <Link to="/client/profile" className="nav-link">
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
  }, [currentUser]);

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
