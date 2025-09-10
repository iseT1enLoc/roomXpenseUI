// export default Invitations;
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllPendingInvitations, updateInvitationStatus } from "../../api/invitation";
import LoadingComponent from "../../component/LoadingIcon";
import InvitationCard from "../../component/InvitationCard";
import BackButton from "../../component/BackButton";


const Invitations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const token = localStorage.getItem("oauthstate");
  async function fetchPendingInvitations() {
    try {
      const res = await getAllPendingInvitations(token);
      setInvitations(res.data); 
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  async function handleUpdateInvitation(recipientId, status) { 
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
    return <LoadingComponent message={"Đang tải dữ liệu phòng..."} />;
  }

  if (error) {
    return <div><h1>Page not found</h1></div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 relative">
        {/* Back button */}
        <BackButton/>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Lời mời vào phòng</h1>
        <div className="flex flex-col gap-6">
          {invitations.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Chưa có lời mời nào 😔</p>
          ) : (
            invitations.map((inv) => (
              <InvitationCard
                key={inv.id} // always add a unique key!
                invitation={inv}
                onUpdate={handleUpdateInvitation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
