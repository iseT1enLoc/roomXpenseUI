import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getRooms } from "../features/room/roomSlice";

const RoomList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { rooms, loading, error: roomError } = useSelector(
    (state) => state.rooms
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ for smooth animation

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    const storedToken = localStorage.getItem("oauthstate");

    if (urlToken && !storedToken) {
      localStorage.setItem("oauthstate", urlToken);
      navigate(location.pathname, { replace: true });
      return;
    }

    if (!urlToken && !storedToken) {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
      return;
    }

    const tokenToUse = storedToken || urlToken;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/protected/user/me`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      })
      .then((res) => {
        setCurrentUser(res.data);
        dispatch(getRooms(tokenToUse));
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("oauthstate");
          navigate("/", { replace: true });
        } else {
          setLocalError("Lỗi lấy thông tin người dùng.");
        }
      });
  }, [location, navigate, dispatch]);

  const handleRoomSelect = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("oauthstate");
    setCurrentUser(null);

    // Start animation
    setIsLoggingOut(true);

    // Navigate after animation ends
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 100); // match CSS transition time
  };

  const getRoomIcon = () => "💰";

  if (loading) {
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        Loading rooms...
      </div>
    );
  }

  if (localError || roomError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {localError || roomError}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 p-6 transition-opacity duration-100 ${
        isLoggingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 relative">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-black font-medium py-2 px-4 rounded-lg shadow transition"
        >
          Logout
        </button>

        <h1 className="text-4xl font-bold text-center text-teal-800 mb-8">
          Vào phòng của bạn điii:))
        </h1>

        {rooms.length === 0 ? (
          <p className="text-center text-gray-600">No rooms available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.room_id} // ✅ use unique key
                onClick={() => handleRoomSelect(room.room_id)}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer"
              >
                <h3 className="text-2xl font-bold text-teal-800 flex items-center">
                  <span className="mr-3 text-3xl">{getRoomIcon()}</span>
                  <span className="truncate">{room.room_name}</span>
                </h3>
                <p className="text-gray-600 mt-2">{room.createdAt}</p>
                <p className="text-gray-600 mt-2">
                  Created by: {room.createdBy ?? "human"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
