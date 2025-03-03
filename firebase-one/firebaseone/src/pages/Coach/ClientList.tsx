import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";
import ImageCropper from "../../components/common/ImageCropper";
import "./ClientList.css";

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
  coachId?: string;
}

const CoachClientList: React.FC = () => {
  const [assignedClients, setAssignedClients] = useState<Client[]>([]);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"assigned" | "available">(
    "assigned"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    const fetchClients = async () => {
      if (!currentUser) return;
      setIsLoading(true);

      try {
        // Fetch assigned clients
        const assignedClientsRef = collection(db, "users");
        const assignedQuery = query(
          assignedClientsRef,
          where("coachId", "==", currentUser.uid),
          where("role", "==", "client")
        );
        const assignedSnapshot = await getDocs(assignedQuery);

        const fetchedAssignedClients = assignedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive?.toDate(),
        })) as Client[];

        setAssignedClients(fetchedAssignedClients);

        // Fetch available clients (clients without a coach)
        const availableClientsRef = collection(db, "users");
        const availableQuery = query(
          availableClientsRef,
          where("role", "==", "client"),
          where("coachId", "==", null)
        );
        const availableSnapshot = await getDocs(availableQuery);

        const fetchedAvailableClients = availableSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastActive: doc.data().lastActive?.toDate(),
        })) as Client[];

        setAvailableClients(fetchedAvailableClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [currentUser]);

  const handleClaimClient = async (clientId: string) => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const clientRef = doc(db, "users", clientId);
      await updateDoc(clientRef, {
        coachId: currentUser.uid,
        updatedAt: serverTimestamp(),
      });

      // Move client from available to assigned
      const claimedClient = availableClients.find(
        (client) => client.id === clientId
      );
      if (claimedClient) {
        setAvailableClients((prev) =>
          prev.filter((client) => client.id !== clientId)
        );
        setAssignedClients((prev) => [
          ...prev,
          { ...claimedClient, coachId: currentUser.uid },
        ]);
      }
    } catch (error) {
      console.error("Error claiming client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (clientId: string) => {
    setUploadError("");
    setSelectedClientId(clientId);
    setShowImageCropper(true);
  };

  const handleCroppedImage = async (croppedImage: Blob) => {
    if (!currentUser || !selectedClientId) return;
    setIsLoading(true);
    setUploadError("");

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;

          // Update user document with base64 string
          const userRef = doc(db, "users", selectedClientId);
          await updateDoc(userRef, {
            photoURL: base64,
            updatedAt: serverTimestamp(),
          });

          // Update local state
          const updateClientPhoto = (clients: Client[]) =>
            clients.map((client) =>
              client.id === selectedClientId
                ? { ...client, photoURL: base64 }
                : client
            );

          setAssignedClients(updateClientPhoto);
          setAvailableClients(updateClientPhoto);
        } catch (error) {
          console.error("Error updating client photo:", error);
          setUploadError("Failed to update photo. Please try again.");
        } finally {
          setIsLoading(false);
          setShowImageCropper(false);
          setSelectedClientId("");
        }
      };

      reader.onerror = () => {
        setUploadError("Failed to read image file. Please try again.");
        setIsLoading(false);
        setShowImageCropper(false);
        setSelectedClientId("");
      };

      reader.readAsDataURL(croppedImage);
    } catch (error) {
      console.error("Error handling photo:", error);
      setUploadError("Failed to process photo. Please try again.");
      setIsLoading(false);
      setShowImageCropper(false);
      setSelectedClientId("");
    }
  };

  const filteredClients =
    activeTab === "assigned"
      ? assignedClients.filter(
          (client) =>
            client.displayName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : availableClients.filter(
          (client) =>
            client.displayName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>Clients Management</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "assigned" ? "active" : ""}`}
            onClick={() => setActiveTab("assigned")}
          >
            Your Clients ({assignedClients.length})
          </button>
          <button
            className={`tab ${activeTab === "available" ? "active" : ""}`}
            onClick={() => setActiveTab("available")}
          >
            Available Clients ({availableClients.length})
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      {isLoading ? (
        <div className="loading">Loading clients...</div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-header">
                <div className="client-photo-container">
                  <img
                    src={
                      client.photoURL ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23e0e0e0'/%3E%3Cpath d='M60 70c12 0 22-10 22-22s-10-22-22-22-22 10-22 22 10 22 22 22zm0 11c-14.7 0-44 7.3-44 22v7h88v-7c0-14.7-29.3-22-44-22z' fill='%23bdbdbd'/%3E%3C/svg%3E"
                    }
                    alt={client.displayName}
                    className="client-avatar"
                  />
                  {activeTab === "assigned" && (
                    <button
                      className="change-photo-btn"
                      onClick={() => handlePhotoUpload(client.id)}
                    >
                      Change Photo
                    </button>
                  )}
                </div>
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
                {activeTab === "assigned" ? (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/coach/plans/edit/${client.currentPlanId}`)
                      }
                      disabled={!client.currentPlanId}
                    >
                      {client.currentPlanId
                        ? "View Current Plan"
                        : "No Active Plan"}
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/coach/plans/new?client=${client.id}`)
                      }
                    >
                      Create New Plan
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/coach/chat?client=${client.id}`)
                      }
                    >
                      Message
                    </button>
                  </>
                ) : (
                  <button
                    className="claim-btn"
                    onClick={() => handleClaimClient(client.id)}
                    disabled={isLoading}
                  >
                    Claim Client
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showImageCropper && (
        <ImageCropper
          onCroppedImage={handleCroppedImage}
          onCancel={() => {
            setShowImageCropper(false);
            setSelectedClientId("");
            setUploadError("");
          }}
          aspectRatio={1}
        />
      )}
    </div>
  );
};

export default CoachClientList;
