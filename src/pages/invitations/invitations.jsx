// export default Invitations;
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllPendingInvitations, updateInvitationStatus } from "../../api/invitation";
import LoadingComponent from "../../component/LoadingIcon";


const Invitations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [invitations, setInvitations] = useState([]);

  async function fetchPendingInvitations() {
    const token = localStorage.getItem("oauthstate");

    try {
      const res = await getAllPendingInvitations(token);
      setInvitations(res.data); // <-- API returns inside `data`
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  async function handleUpdateInvitation(recipientId, status) {
    const token = localStorage.getItem("oauthstate");
    try {
      await updateInvitationStatus(recipientId, status,token);
      // Refresh invitations after update
      fetchPendingInvitations();
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  if (loading) {
    return <LoadingComponent message={"Fetching invitation..."} />;
  }

  if (error) {
    return <div><h1>Page not found</h1></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 relative">
        {/* Back button */}
        <div className="flex justify-start mb-6">
          <Button
            variant="outlined"
            className="rounded-full px-5"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Invitations</h1>

        {/* Invitations list */}
        <div className="flex flex-col gap-6">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="w-full bg-white border border-teal-100 rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300"
            >
              {/* Left side: Avatar + Info */}
              <div className="flex items-center gap-4">
                {/* Avatar (first letter of inviter name) */}
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-400 text-white flex items-center justify-center rounded-full font-bold text-xl shadow-md">
                  {inv.invitation?.FromUser?.name?.charAt(0) || "?"}
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Room Invitation
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-teal-600">
                      {inv.invitation?.FromUser?.name || "Someone"}
                    </span>{" "}
                    has invited you to join{" "}
                    <span className="font-medium text-teal-600">
                      {inv.invitation?.Room?.room_name || "a room"}
                    </span>
                  </p>
                  {/* Invitation message */}
                  <p className="text-xs text-gray-500 mt-1 italic">
                    "{inv.invitation?.invitation_message}"
                  </p>
                </div>
              </div>

              {/* Right side: Actions */}
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  color="success"
                  className="rounded-full px-6 shadow-sm"
                  onClick={() => handleUpdateInvitation(inv.id, "accepted")}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  className="rounded-full px-6"
                  onClick={() => handleUpdateInvitation(inv.id, "denied")}
                >
                  Deny
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
