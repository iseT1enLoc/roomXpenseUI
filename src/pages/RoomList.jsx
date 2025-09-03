import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchRooms, 
  clearUser,
  selectRooms, 
  selectRoomsLoading, 
  selectRoomsError 
} from "../app/userSlice";

const RoomList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const roomError = useSelector(selectRoomsError);

  // Local state
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle token & fetch rooms
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get("token");
    const storedToken = localStorage.getItem("oauthstate");

    if (urlToken && !storedToken) {
      localStorage.setItem("oauthstate", urlToken);
      navigate(location.pathname, { replace: true });
      return;
    }

    // If no token anywhere, redirect to login
    if (!urlToken && !storedToken) {
      if (location.pathname !== "/") navigate("/", { replace: true });
      return;
    }

    // Set current user and fetch rooms
    const tokenToUse = storedToken || urlToken;
    setCurrentUser({ token: tokenToUse });
    
    // Pass token to the thunk
    dispatch(fetchRooms({ token: tokenToUse }));
  }, [location, navigate, dispatch]);

  const handleRoomSelect = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearUser());
    
    // Clear localStorage
    localStorage.removeItem("oauthstate");
    
    // Clear local state
    setCurrentUser(null);
    setIsLoggingOut(true);
    
    // Navigate after brief delay for animation
    setTimeout(() => navigate("/", { replace: true }), 500);
  };

  const getRoomIcon = () => "💰";

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (roomError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-lg mb-6">Error: {roomError}</p>
          <button
            onClick={() => dispatch(fetchRooms({ token: currentUser?.token }))}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-lg shadow transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 p-6 transition-opacity duration-200 ${
        isLoggingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 relative">
        {/* Header with logout button */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-teal-800 flex items-center">
            <span className="mr-3 text-4xl">💰</span>
            Your Rooms
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-black font-medium py-2 px-4 rounded-lg shadow transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Rooms grid or empty state */}
        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.room_id || room.id}
                onClick={() => handleRoomSelect(room.room_id || room.id)}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-teal-800 flex items-center flex-1 min-w-0">
                    <span className="mr-3 text-2xl group-hover:scale-110 transition-transform">
                      {getRoomIcon()}
                    </span>
                    <span className="truncate">{room.room_name || room.name || "Unnamed Room"}</span>
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Created:</span>
                    {room.createdAt
                      ? new Date(room.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium mr-2">By:</span>
                    {room.createdBy || "Unknown"}
                  </p>
                </div>

                {/* Optional: Add room stats if available */}
                {room.memberCount && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {room.memberCount} member{room.memberCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No rooms yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't joined any rooms yet. Create or join one to get started!
            </p>
            <button
              onClick={() => navigate("/create-room")} // Adjust path as needed
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg shadow transition-colors"
            >
              Create Your First Room
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RoomList;