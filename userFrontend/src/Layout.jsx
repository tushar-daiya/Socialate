import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex">
      <Navbar />
      <div className="w-5/6 px-10 py-5 ml-auto mb-10">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
