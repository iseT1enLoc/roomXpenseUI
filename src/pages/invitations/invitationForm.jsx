import React, { useState } from "react";
import { sendRoomInvitation } from "../../api/invitation"

export default function SendInvitationForm({ roomId }) {
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("oauthstate");
    try {
      await sendRoomInvitation({
        room_id: roomId,
        emails: emails.split(",").map((email) => email.trim()),
        message,
        token,
      });
      setSuccess("Lời mời đã được gửi thành công ✅");
      setEmails("");
      setMessage("");
    } catch (err) {
      setError("Không thể gửi lời mời ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Mời thành viên vào phòng</h2>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email list */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email thành viên (cách nhau bằng dấu phẩy)
          </label>
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="vd: abc@gmail.com, xyz@gmail.com"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Lời nhắn
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Mời bạn vào phòng..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-black py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi lời mời"}
        </button>
      </form>
    </div>
  );
}
