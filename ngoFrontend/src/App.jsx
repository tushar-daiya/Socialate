import { useState } from "react";
import "./App.css";
import Register from "./pages/Register";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/Login";
import CreateCamp from "./pages/CreateCamp";
import RequireAccess from "./components/requireAccess";
import Donations from "./pages/Donations";
import Camps from "./pages/Camps";
import CampPage from "./pages/CampPage";
import EditCamp from "./pages/EditCamp";
import Profile from "./pages/Profile";
import Volunteers from "./pages/Volunteers";
import AuthLayout from "./AuthLayout";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<RequireAccess />}>
          <Route path="createcamp" element={<CreateCamp />} />
          <Route path="donations" element={<Donations />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route index element={<Camps />} />
          <Route path="camp/:id" element={<CampPage />} />
          <Route path="editcamp/:id" element={<EditCamp />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
