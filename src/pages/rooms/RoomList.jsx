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
import { Button, Menu, MenuItem, Avatar, Badge,Box,IconButton } from "@mui/material";
import { refreshToken } from "../../api/authService";
import FormDialog from "../../component/CreateRoomForm";
import { createNewRoom } from "../../api/roomService";
import toast, { Toaster } from "react-hot-toast";
import LoadingComponent from "../../component/LoadingIcon";
import { getAllPendingInvitations } from "../../api/invitation";
import RoomCard from "../../component/RoomCard";
import LogoutModal from "../../component/LogOutModal";
import { fetchCurrentUser, getCurrentUser } from "../../api/user";

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
  const [invitations, setInvitations] = useState([]);
  const pendingInvitations = invitations?.length || 0; // your fetched invitations array
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const fetchUser = async () => {
    const storedToken = localStorage.getItem("oauthstate");
    if (!storedToken) return;

    try {
      const userData = await fetchCurrentUser(storedToken);
      console.log(userData);
      setCurrentUser(userData);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      // Optionally redirect to login
    }
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
  useEffect(() => {
    if (!token) return;
    fetchInvitations();
    fetchUser();
  }, [token]);
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
  
  const fetchInvitations = async () => {
    try {
      const res = await getAllPendingInvitations(token)
      setInvitations(res.data || []); // save invitations to state
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    }
  };  

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
      await createNewRoom(room_name, token);
      dispatch(fetchRooms({ token }));
      toast.success("Tạo phòng thành công! 🎉");

    } catch (error) {
      toast.error("Tạo phòng thất bại. Xin hãy thử lại: ",error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <LoadingComponent message={"Đang tải dữ liệu..."}/>
    );
  }

  // Error state
  if (roomError) {
    return (
      <ErrorComponent handleRetry={handleRetry}/>
    );
  }
 

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 p-6 transition-opacity duration-200 ${
        isLoggingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 relative">
      <div className="flex justify-between items-center mb-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-teal-800 flex items-center">
          <span className="mr-3 text-4xl">💰</span>
          Phòng của bạn
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Box className="flex items-center gap-4">
          {/* Create Room */}
          <FormDialog onSubmit={handleOnSubmitCreateRoom} />

          {/* Avatar with Badge */}
          <IconButton onClick={(e) => setAccountMenuAnchor(e.currentTarget)}>
            <Badge
              color="error"
              badgeContent={pendingInvitations > 0 ? pendingInvitations : null}
              overlap="circular"
            >
            <Avatar sx={{ width: 36, height: 36 }}>
              {currentUser?.data?.name ? currentUser.data.name.charAt(0) : "?"}
            </Avatar>
            </Badge>
          </IconButton>

          {/* Menu */}
          <Menu
            anchorEl={accountMenuAnchor}
            open={Boolean(accountMenuAnchor)}
            onClose={() => setAccountMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setAccountMenuAnchor(null);
                navigate("/rooms/invitations");
              }}
            >
              Invitations
              {pendingInvitations > 0 && (
                <span className="ml-2 text-sm font-semibold text-red-500">
                  {pendingInvitations}
                </span>
              )}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAccountMenuAnchor(null);
                setShowModal(true);
              }}
              sx={{ color: "red" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
        </div>
      </div>


        {/* Rooms grid or empty state */}
        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.room_id || room.id}
                room={room}
                handleRoomSelect={handleRoomSelect}
                getRoomIcon={() => '💰'}
              />
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
        {/* Modal */}
        {showModal && (
          <LogoutModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleLogout}
          />
        )}
    </div>
  );
};

export default RoomList;
