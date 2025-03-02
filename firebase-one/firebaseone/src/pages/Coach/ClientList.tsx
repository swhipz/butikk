import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";

interface Client {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  goals: string[];
  measurements: {
    height: number;
    weight: number;
    bodyFat?: number;
  };
  currentPlanId?: string;
  lastActive?: Date;
}

const CoachClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser) return;

      const clientsRef = collection(db, "users");
      const q = query(clientsRef, where("coachId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const fetchedClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.toDate(),
      })) as Client[];

      setClients(fetchedClients);
    };

    fetchClients();
  }, [currentUser]);

  const filteredClients = clients.filter(
    (client) =>
      client.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>Your Clients</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="clients-grid">
        {filteredClients.map((client) => (
          <div key={client.id} className="client-card">
            <div className="client-header">
              <img
                src={client.photoURL || "/default-avatar.png"}
                alt={client.displayName}
                className="client-avatar"
              />
              <div className="client-info">
                <h2>{client.displayName}</h2>
                <p>{client.email}</p>
                {client.lastActive && (
                  <p className="last-active">
                    Last active: {client.lastActive.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="client-details">
              <div className="measurements">
                <h3>Measurements</h3>
                <p>Height: {client.measurements.height} cm</p>
                <p>Weight: {client.measurements.weight} kg</p>
                {client.measurements.bodyFat && (
                  <p>Body Fat: {client.measurements.bodyFat}%</p>
                )}
              </div>

              <div className="goals">
                <h3>Goals</h3>
                <ul>
                  {client.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="client-actions">
              <button
                onClick={() =>
                  navigate(`/coach/plans/edit/${client.currentPlanId}`)
                }
                disabled={!client.currentPlanId}
              >
                {client.currentPlanId ? "View Current Plan" : "No Active Plan"}
              </button>
              <button
                onClick={() => navigate(`/coach/plans/new?client=${client.id}`)}
              >
                Create New Plan
              </button>
              <button
                onClick={() => navigate(`/coach/chat?client=${client.id}`)}
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachClientList;
