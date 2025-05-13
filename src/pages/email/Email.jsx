import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const SendExpenditurePage = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");

  const handleSendReport = async () => {
    if (!month || !year) {
      alert("Please select month and year.");
      return;
    }

    const token = localStorage.getItem("oauthstate");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/public/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id,
          month,
          year,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send report");
      }

      setStatus("✅ Report sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send report. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-xl w-full space-y-6 relative">

        {/* Back Button inside the box */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-1" size={20} />
          Trở lại
        </button>

        {/* Add top padding to avoid overlapping with button */}
        <div className="pt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Gửi báo cáo tháng</h2>
          <p className="text-sm text-gray-600 mt-1">
            Room ID: <span className="font-mono">{room_id}</span>
          </p>
        </div>

        <div className="flex flex-col space-y-3 text-left">
          <label className="text-sm font-medium text-gray-700">Tháng:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Thêm tháng"
          />

          <label className="text-sm font-medium text-gray-700">Năm:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Thêm năm"
          />

          <label className="text-sm font-medium text-gray-700">Thông điệp (Tự chọn):</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Thêm thông điệp(tự chọn)"
          />
        </div>

        <button
          onClick={handleSendReport}
          className="w-full bg-black text-black py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Gửi báo cáo cho cả phòng
        </button>

        {status && <p className="text-sm text-center mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default SendExpenditurePage;
