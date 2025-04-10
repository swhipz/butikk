import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";
import ChatWindow from "../../components/chat/ChatWindow";

interface Client {
  id: string;
  displayName: string;
  photoURL: string;
  lastMessage?: {
    text: string;
    timestamp: Date;
  };
}

const CoachChat: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser) return;

      const clientsRef = collection(db, "users");
      const q = query(clientsRef, where("coachId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      const fetchedClients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];

      setClients(fetchedClients);

      // If client ID is provided in URL, select that client
      const clientId = searchParams.get("client");
      if (clientId) {
        const client = fetchedClients.find((c) => c.id === clientId);
        if (client) {
          setSelectedClient(client);
        }
      }
    };

    fetchClients();
  }, [currentUser, searchParams]);

  return (
    <div className="chat-page">
      <div className="clients-sidebar">
        <h2>Your Clients</h2>
        <div className="clients-list">
          {clients.map((client) => (
            <div
              key={client.id}
              className={`client-item ${
                selectedClient?.id === client.id ? "selected" : ""
              }`}
              onClick={() => setSelectedClient(client)}
            >
              <img
                src={client.photoURL || "/default-avatar.png"}
                alt={client.displayName}
                className="client-avatar"
              />
              <div className="client-info">
                <h3>{client.displayName}</h3>
                {client.lastMessage && (
                  <p className="last-message">
                    {client.lastMessage.text}
                    <span className="timestamp">
                      {client.lastMessage.timestamp.toLocaleTimeString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {selectedClient ? (
          <>
            <div className="chat-header">
              <img
                src={selectedClient.photoURL || "/default-avatar.png"}
                alt={selectedClient.displayName}
                className="client-avatar"
              />
              <h2>Chat with {selectedClient.displayName}</h2>
            </div>
            <ChatWindow recipientId={selectedClient.id} />
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a client to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachChat;
