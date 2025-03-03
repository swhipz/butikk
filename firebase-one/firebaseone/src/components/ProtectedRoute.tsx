import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseconfig";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "client" | "coach";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { currentUser, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      if (requiredRole && currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        setHasAccess(userData?.role === requiredRole);
      } else {
        setHasAccess(true);
      }
    };

    checkRole();
  }, [currentUser, requiredRole]);

  if (loading || hasAccess === null) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    // Redirect to the appropriate dashboard based on their role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
