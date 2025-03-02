import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

const ClientDashboard: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);
  const [nextSession, setNextSession] = useState<Date | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      // Fetch current plan
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();

      if (userData?.currentPlanId) {
        const planDoc = await getDoc(doc(db, "plans", userData.currentPlanId));
        if (planDoc.exists()) {
          setCurrentPlan({
            id: planDoc.id,
            ...planDoc.data(),
            startDate: planDoc.data().startDate.toDate(),
            endDate: planDoc.data().endDate.toDate(),
          } as WorkoutPlan);
        }
      }

      // You could fetch next session from a sessions collection
      // For now, we'll just set it to tomorrow
      setNextSession(new Date(Date.now() + 24 * 60 * 60 * 1000));
    };

    fetchDashboardData();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <h1>Welcome back!</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card current-plan">
          <h2>Current Plan</h2>
          {currentPlan ? (
            <>
              <h3>{currentPlan.title}</h3>
              <p>{currentPlan.description}</p>
              <button onClick={() => navigate("/client/plans")}>
                View Full Plan
              </button>
            </>
          ) : (
            <p>No active plan. Contact your coach to get started!</p>
          )}
        </div>

        <div className="dashboard-card next-session">
          <h2>Next Session</h2>
          {nextSession ? (
            <>
              <p>Date: {nextSession.toLocaleDateString()}</p>
              <p>Time: {nextSession.toLocaleTimeString()}</p>
              <button onClick={() => navigate("/client/chat")}>
                Message Coach
              </button>
            </>
          ) : (
            <p>No upcoming sessions scheduled</p>
          )}
        </div>

        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <button onClick={() => navigate("/client/profile")}>
            Update Profile
          </button>
          <button onClick={() => navigate("/client/chat")}>
            Chat with Coach
          </button>
          <button onClick={() => navigate("/client/plans")}>
            View Workout Plans
          </button>
        </div>

        <div className="dashboard-card progress">
          <h2>Progress Overview</h2>
          {/* Add progress charts/stats here */}
          <p>Coming soon: Progress tracking and analytics</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
