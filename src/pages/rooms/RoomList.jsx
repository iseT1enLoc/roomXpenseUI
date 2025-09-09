import { useEffect, useState } from "react";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchRooms, 
  selectRooms, 
  selectRoomsLoading, 
  selectRoomsError 
} from "../../app/userSlice";
import { loginSuccess, logout } from "../../app/authSlice";
import { useAppSelector } from "../../app/store";
import { Button } from "@mui/material";
import { refreshToken } from "../../api/authService";
import FormDialog from "../../component/CreateRoomForm";
import { createNewRoom } from "../../api/roomService";
import toast, { Toaster } from "react-hot-toast";
import LoadingComponent from "../../component/LoadingIcon";
import ErrorComponent from "../../component/ErrorComponent";
const RoomList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  // Redux state
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const roomError = useSelector(selectRoomsError);

  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
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

  const handleRoomSelect = (roomId, room_name) => {
    navigate(`/room/${roomId}/${encodeURIComponent(room_name)}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const storedToken = localStorage.getItem("oauthstate");

    const saveAuth = (authToken) => {
      dispatch(loginSuccess(authToken));
      localStorage.setItem("oauthstate", authToken);

      window.history.replaceState({}, document.title, window.location.pathname);
    };

    if (tokenFromUrl) {
      saveAuth(tokenFromUrl);
    } else if (storedToken && !token) {
      saveAuth(storedToken);
    }
  }, [dispatch, navigate, token]);
  const handleLogout = () => {
    // Clear Redux state
    dispatch(logout());
    
    // Clear localStorage
    localStorage.removeItem("oauthstate");
    
    // Clear local state
    setCurrentUser(null);
    setIsLoggingOut(true);
    
    // // Navigate after brief delay for animation
    setTimeout(() => navigate("/", { replace: true }), 500);
  };
  const handleRetry = async () => {
    try {
      const oldToken= localStorage.getItem("oauthstate");

      if (!oldToken) {
        throw new Error("No token available");
      }

      const newToken = await refreshToken(oldToken);

      if (!newToken) {
        throw new Error("No token returned from server");
      }

      // Save to Redux + localStorage
      dispatch(loginSuccess(newToken));
      localStorage.setItem("oauthstate", newToken);

      // Retry fetching rooms with the new token
      dispatch(fetchRooms({ token: newToken }));
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("oauthstate");
      navigate("/");
    }
  };
  const handleOnSubmitCreateRoom = async (room_name) => {
    const token = localStorage.getItem("oauthstate");
    try {
      const response = await createNewRoom(room_name, token);
      console.log("Room created:", response.data);

      // ✅ refresh rooms
      dispatch(fetchRooms({ token }));
      toast.success("Room created successfully! 🎉");

    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room. Please try again.");
    }
  };
  const getRoomIcon = () => "💰";

  // Loading state
  if (loading) {
    return (
      <LoadingComponent message={"Loading room..."}/>
    );
  }

  // Error state
  if (roomError) {
    return (
      <ErrorComponent handleRetry={handleRetry}/>
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
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-4xl font-bold text-teal-800 flex items-center">
            <span className="mr-3 text-4xl">💰</span>
            Your Rooms
        </h1>
        <FormDialog onSubmit={handleOnSubmitCreateRoom}/>
        <Button variant="contained" color="outlined" onClick={() =>{navigate("/rooms/invitations",replace)}}>
          Invitations
        </Button>
        <Button variant="contained" color="outlined" onClick={() => setShowModal(true)}>
          Logout
        </Button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-white to-teal-100 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-12 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-grey font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Rooms grid or empty state */}
        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.room_id || room.id}
                onClick={() => handleRoomSelect(room.room_id || room.id, room.room_name)}
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
            <FormDialog onSubmit={handleOnSubmitCreateRoom}/>
          </div>
        )}
      <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default RoomList;