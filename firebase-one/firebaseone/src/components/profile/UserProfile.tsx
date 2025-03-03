import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useAuth } from "../../contexts/AuthContext";
import "./UserProfile.css";

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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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

    try {
      const file = e.target.files[0];
      console.log("Starting upload for file:", file.name);

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }
      if (file.size > 500 * 1024) {
        // 500KB max
        throw new Error("File size must be less than 500KB");
      }

      setUploadProgress(10);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;
          setUploadProgress(50);

          // Update Firestore with base64 string
          await updateDoc(doc(db, "users", currentUser.uid), {
            photoURL: base64,
            updatedAt: new Date(),
          });
          console.log("Firestore document updated");

          if (profile) {
            setProfile({ ...profile, photoURL: base64 });
          }

          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 2000);
        } catch (error) {
          console.error("Error updating profile:", error);
          setUploadProgress(0);
          alert("Failed to update profile photo. Please try again.");
        }
      };

      reader.onerror = () => {
        setUploadProgress(0);
        alert("Failed to read file. Please try again.");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling photo:", error);
      setUploadProgress(0);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to upload photo. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!currentUser || !profile) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...profile,
        updatedAt: new Date(),
      });
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
          <img
            src={
              profile.photoURL ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23e0e0e0'/%3E%3Cpath d='M60 70c12 0 22-10 22-22s-10-22-22-22-22 10-22 22 10 22 22 22zm0 11c-14.7 0-44 7.3-44 22v7h88v-7c0-14.7-29.3-22-44-22z' fill='%23bdbdbd'/%3E%3C/svg%3E"
            }
            alt="Profile"
          />
          {isEditing && (
            <div className="photo-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="photo-upload"
              />
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
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
