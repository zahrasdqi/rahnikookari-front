import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const APPROVED_PROFILE_STATUSES = ["APPROVED", "ACTIVE"];

const getProfileFromResponse = (value) => {
  if (!value) return null;
  if (value.profile) return value.profile;
  if (value.has_profile === false) return null;
  return value;
};

const isTruthyPublished = (value) => {
  return value === true || value === "true" || value === 1 || value === "1";
};

const getProfileStatus = (profile) => {
  return profile?.status ?? profile?.approval_status ?? profile?.verification_status;
};

const getProfilePublished = (profile) => {
  return profile?.is_published ?? profile?.isPublished ?? profile?.published;
};

const ApprovedCharityRoute = ({ children }) => {
  const { isAuthenticated, charityProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">در حال بررسی دسترسی...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const profile = getProfileFromResponse(charityProfile);
  const normalizedStatus = String(getProfileStatus(profile)).trim().toUpperCase();
  const isPublished = isTruthyPublished(getProfilePublished(profile));

  const canAccessCharityDashboard = Boolean(
    profile &&
      APPROVED_PROFILE_STATUSES.includes(normalizedStatus) &&
      isPublished
  );

  if (!canAccessCharityDashboard) {
    console.log("[ApprovedCharityRoute] profile:", profile);
    console.log("[ApprovedCharityRoute] status:", normalizedStatus);
    console.log("[ApprovedCharityRoute] published:", getProfilePublished(profile));
    console.log("[ApprovedCharityRoute] checks:", {
      hasProfile: Boolean(profile),
      isApprovedStatus: APPROVED_PROFILE_STATUSES.includes(normalizedStatus),
      isPublished,
    });

    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          from: location,
          accessDeniedMessage:
            "برای دسترسی به داشبورد موسسه، ابتدا باید پروفایل موسسه شما تأیید شود و در حالت انتشار باشد.",
        }}
      />
    );
  }

  return children;
};

export default ApprovedCharityRoute;
