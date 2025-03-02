import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  role: "client" | "coach";
  bio: string;
  goals?: string[];
  specialties?: string[]; // For coaches
  experience?: string; // For coaches
  measurements?: {
    height: number;
    weight: number;
    bodyFat?: number;
  }; // For clients
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      const profileDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data() as UserProfile);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      if (profile) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL,
        });
        setProfile({ ...profile, photoURL });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !profile) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), { ...profile });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-photo">
          <img src={profile.photoURL || "/default-avatar.png"} alt="Profile" />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="photo-upload"
            />
          )}
        </div>
        <div className="profile-info">
          {isEditing ? (
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              className="name-input"
            />
          ) : (
            <h2>{profile.displayName}</h2>
          )}
          <p>{profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      </div>

      <div className="profile-details">
        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tell us about yourself"
            className="bio-input"
          />
        ) : (
          <p>{profile.bio}</p>
        )}

        {profile.role === "coach" && (
          <div className="coach-details">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={profile.experience}
                  onChange={(e) =>
                    setProfile({ ...profile, experience: e.target.value })
                  }
                  placeholder="Years of experience"
                />
                <input
                  type="text"
                  value={profile.specialties?.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      specialties: e.target.value.split(", "),
                    })
                  }
                  placeholder="Specialties (comma-separated)"
                />
              </>
            ) : (
              <>
                <p>Experience: {profile.experience}</p>
                <p>Specialties: {profile.specialties?.join(", ")}</p>
              </>
            )}
          </div>
        )}

        {profile.role === "client" && profile.measurements && (
          <div className="client-measurements">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={profile.measurements.height}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      measurements: {
                        ...profile.measurements!,
                        height: parseFloat(e.target.value),
                      },
                    })
                  }
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  value={profile.measurements.weight}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      measurements: {
                        ...profile.measurements!,
                        weight: parseFloat(e.target.value),
                      },
                    })
                  }
                  placeholder="Weight (kg)"
                />
                <input
                  type="number"
                  value={profile.measurements.bodyFat}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      measurements: {
                        ...profile.measurements!,
                        bodyFat: parseFloat(e.target.value),
                      },
                    })
                  }
                  placeholder="Body Fat %"
                />
              </>
            ) : (
              <>
                <p>Height: {profile.measurements.height} cm</p>
                <p>Weight: {profile.measurements.weight} kg</p>
                {profile.measurements.bodyFat && (
                  <p>Body Fat: {profile.measurements.bodyFat}%</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
