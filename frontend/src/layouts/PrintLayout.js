import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useRef } from "react";
import kuds from "../assets/images/kuds.png";
export default function RootLayout() {

  return (
    <div >
          <Outlet />
    </div>
  );
}
