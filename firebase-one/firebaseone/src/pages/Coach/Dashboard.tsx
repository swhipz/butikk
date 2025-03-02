import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";

interface Client {
  id: string;
  displayName: string;
  photoURL: string;
  lastActive?: Date;
}

interface UpcomingSession {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  type: string;
}

const CoachDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      // Fetch clients
      const clientsRef = collection(db, "users");
      const q = query(clientsRef, where("coachId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const fetchedClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate(),
      })) as Client[];

      setClients(fetchedClients);

      // Fetch upcoming sessions (you would implement this based on your sessions collection)
      // For now, we'll use dummy data
      setUpcomingSessions([
        {
          id: "1",
          clientId: fetchedClients[0]?.id || "",
          clientName: fetchedClients[0]?.displayName || "",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          type: "Check-in",
        },
      ]);
    };

    fetchDashboardData();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <h1>Coach Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card clients-overview">
          <h2>Your Clients</h2>
          <div className="clients-list">
            {clients.map((client) => (
              <div key={client.id} className="client-item">
                <img
                  src={client.photoURL || "/default-avatar.png"}
                  alt={client.displayName}
                  className="client-avatar"
                />
                <div className="client-info">
                  <h3>{client.displayName}</h3>
                  {client.lastActive && (
                    <p>Last active: {client.lastActive.toLocaleDateString()}</p>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/coach/chat?client=${client.id}`)}
                >
                  Message
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/coach/clients")}
            className="view-all-btn"
          >
            View All Clients
          </button>
        </div>

        <div className="dashboard-card upcoming-sessions">
          <h2>Upcoming Sessions</h2>
          <div className="sessions-list">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <h3>
                    {session.type} with {session.clientName}
                  </h3>
                  <p>{session.date.toLocaleString()}</p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/coach/chat?client=${session.clientId}`)
                  }
                >
                  Message Client
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <button onClick={() => navigate("/coach/plans/new")}>
            Create New Plan
          </button>
          <button onClick={() => navigate("/coach/clients")}>
            Manage Clients
          </button>
          <button onClick={() => navigate("/coach/profile")}>
            Update Profile
          </button>
        </div>

        <div className="dashboard-card stats">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Clients</h3>
              <p>{clients.length}</p>
            </div>
            <div className="stat-item">
              <h3>Active Plans</h3>
              <p>Coming soon</p>
            </div>
            <div className="stat-item">
              <h3>Sessions This Week</h3>
              <p>{upcomingSessions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
