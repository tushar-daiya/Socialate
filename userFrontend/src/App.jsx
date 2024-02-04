import "./App.css";
import Signup from "./pages/Signup";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import Login from "./pages/Login";
import { Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import RequireAccess from "./pages/requireAccess";
import Layout from "./Layout";
import Ngos from "./pages/Ngos";
import DonationCamps from "./pages/DonationCamps";
import NgoPage from "./pages/NgoPage";
import CampPage from "./pages/CampPage";
import Donation from "./pages/Donation";
import MyDonations from "./pages/MyDonations";
import MyVolunteering from "./pages/MyVolunteering";
import AuthLayout from "./AuthLayout";
import LandingPage from "./pages/LandingPage";
function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route element={<RequireAccess />}>
              <Route index element={<Ngos />} />
              <Route path="ngos/:id" element={<NgoPage />} />
              <Route path="camps" element={<DonationCamps />} />
              <Route path="camp/:id" element={<CampPage />} />
              <Route path="donatefood/:id" element={<Donation />} />
              <Route path="my-donations" element={<MyDonations />} />
              <Route path="my-volunteering" element={<MyVolunteering />} />
            </Route>
          </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
            </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
