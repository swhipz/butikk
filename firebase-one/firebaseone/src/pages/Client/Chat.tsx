import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";
import ChatWindow from "../../components/chat/ChatWindow";

interface Coach {
  id: string;
  displayName: string;
  photoURL: string;
}

const ClientChat: React.FC = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCoach = async () => {
      if (!currentUser) return;

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();

      if (userData?.coachId) {
        const coachDoc = await getDoc(doc(db, "users", userData.coachId));
        if (coachDoc.exists()) {
          setCoach({
            id: coachDoc.id,
            displayName: coachDoc.data().displayName,
            photoURL: coachDoc.data().photoURL,
          });
        }
      }
    };

    fetchCoach();
  }, [currentUser]);

  if (!coach) {
    return (
      <div className="chat-container">
        <p>
          No coach assigned. Please contact support to get matched with a coach.
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src={coach.photoURL || "/default-avatar.png"}
          alt={coach.displayName}
          className="coach-avatar"
        />
        <h2>Chat with {coach.displayName}</h2>
      </div>
      <ChatWindow recipientId={coach.id} />
    </div>
  );
};

export default ClientChat;
