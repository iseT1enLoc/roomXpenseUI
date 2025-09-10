import { Button } from "@mui/material";

export default function InvitationCard({ invitation, onUpdate }) {
  
  return (
    <div
      className="w-full bg-white border border-teal-100 rounded-2xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300"
    >
      {/* Left side: Avatar + Info */}
      <div className="flex items-center gap-4">
        {/* Avatar (first letter of inviter name) */}
        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-400 text-white flex items-center justify-center rounded-full font-bold text-xl shadow-md">
          {invitation.invitation?.FromUser?.name?.charAt(0) || "?"}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Mời vào phòng
          </h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-teal-600">
              {invitation.invitation?.FromUser?.name || "Someone"}
            </span>{" "}
            vừa mời bạn tham gia phòng{" "}
            <span className="font-medium text-teal-600">
              {invitation.invitation?.Room?.room_name || "a room"}
            </span>
          </p>
          {/* Invitation message */}
          <p className="text-xs text-gray-500 mt-1 italic">
            "{invitation.invitation?.invitation_message}"
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex gap-2">
        <Button
          variant="contained"
          color="success"
          className="rounded-full px-6 shadow-sm"
          onClick={() => onUpdate(invitation.id, "accepted")}
        >
          Đồng ý
        </Button>
        <Button
          variant="outlined"
          color="error"
          className="rounded-full px-6"
          onClick={() => onUpdate(invitation.id, "denied")}
        >
          Từ chối
        </Button>
      </div>
    </div>
  );
}
