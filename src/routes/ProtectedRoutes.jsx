import { Outlet,Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../app/authSlice";
const ProtectedRoutes=()=>{
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return isAuthenticated?<Outlet></Outlet>:<Navigate to="/" replace/>
}
export default ProtectedRoutes;