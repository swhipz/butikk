import React from "react";
import UserProfile from "../../components/profile/UserProfile";

const ClientProfile: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <UserProfile />
    </div>
  );
};

export default ClientProfile;
