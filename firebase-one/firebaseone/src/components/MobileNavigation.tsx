import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";
import "./MobileNavigation.css";

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [currentUser]);

  if (!currentUser || !userRole) return null;

  const isActive = (path: string) => {
    if (path === "/coach" || path === "/client") {
      // For dashboard, check if we're at the root of coach or client path
      return location.pathname === path;
    } else if (path === "/coach/clients") {
      // For client management, check if the path starts with /coach/clients
      return location.pathname.startsWith("/coach/clients");
    }
    // For all other paths, use exact match
    return location.pathname === path;
  };

  const renderCoachNav = () => (
    <nav className="mobile-nav">
      <button
        onClick={() => navigate("/coach")}
        className={isActive("/coach") ? "active" : ""}
      >
        <i className="far fa-compass"></i>
      </button>
      <button
        onClick={() => navigate("/coach/clients")}
        className={isActive("/coach/clients") ? "active" : ""}
      >
        <i className="far fa-users"></i>
      </button>
      <button
        onClick={() => navigate("/coach/plans")}
        className={isActive("/coach/plans") ? "active" : ""}
      >
        <i className="far fa-clipboard"></i>
      </button>
      <button
        onClick={() => navigate("/coach/chat")}
        className={isActive("/coach/chat") ? "active" : ""}
      >
        <i className="far fa-comments"></i>
      </button>
      <button
        onClick={() => navigate("/coach/profile")}
        className={isActive("/coach/profile") ? "active" : ""}
      >
        <i className="far fa-user-circle"></i>
      </button>
    </nav>
  );

  const renderClientNav = () => (
    <nav className="mobile-nav">
      <button
        onClick={() => navigate("/client")}
        className={isActive("/client") ? "active" : ""}
      >
        <i className="far fa-compass"></i>
      </button>
      <button
        onClick={() => navigate("/client/plans")}
        className={isActive("/client/plans") ? "active" : ""}
      >
        <i className="far fa-clipboard"></i>
      </button>
      <button
        onClick={() => navigate("/client/chat")}
        className={isActive("/client/chat") ? "active" : ""}
      >
        <i className="far fa-comments"></i>
      </button>
      <button
        onClick={() => navigate("/client/profile")}
        className={isActive("/client/profile") ? "active" : ""}
      >
        <i className="far fa-user-circle"></i>
      </button>
    </nav>
  );

  return userRole === "coach" ? renderCoachNav() : renderClientNav();
};

export default MobileNavigation;
