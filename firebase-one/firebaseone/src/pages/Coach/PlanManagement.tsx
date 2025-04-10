import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";
import PlanEditor from "../../components/plans/PlanEditor";

interface Client {
  id: string;
  displayName: string;
}

const PlanManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser) return;

      const clientsRef = collection(db, "users");
      const q = query(clientsRef, where("coachId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const fetchedClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
      }));

      setClients(fetchedClients);

      // If client ID is provided in URL, select that client
      const clientId = searchParams.get("client");
      if (clientId) {
        setSelectedClientId(clientId);
      }
    };

    fetchClients();
  }, [currentUser, searchParams]);

  return (
    <div className="plan-management-page">
      <div className="page-header">
        <h1>Workout Plan Management</h1>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="client-selector"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.displayName}
            </option>
          ))}
        </select>
      </div>

      {selectedClientId ? (
        <PlanEditor clientId={selectedClientId} />
      ) : (
        <div className="no-client-selected">
          <p>Select a client to create or edit their workout plan</p>
          <button onClick={() => navigate("/coach/clients")}>
            View All Clients
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
