import React from "react";
import UserProfile from "../../components/profile/UserProfile";

const CoachProfile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>Coach Profile</h1>
      <UserProfile />
    </div>
  );
};

export default CoachProfile;
