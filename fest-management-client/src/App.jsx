import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AdminDashboard from "./components/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ManageRequests from "./components/ManageRequests";
import AddFestForm from "./components/AddFestForm";
import AddEventForm from "./components/AddEventForm";
import EditFestForm from "./components/EditFestForm";
import EditEventForm from "./components/EditEventForm";
import FestEventsPage from "./components/FestEventsPage";
import PrivateRoute from "./components/PrivateRoute";
import MainAdminLogin from "./components/MainAdminLogin";
import ViewFestsPage from "./components/ViewFestsPage";
import UserEventPage from "./components/UserEventPage";
import EventDetailPage from "./components/EventDetailPage";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mainadmin-login" element={<MainAdminLogin />} />
        <Route path="/view-fests" element={<ViewFestsPage />} />
        <Route
          path="/fests/:festId/events/:eventId"
          element={<EventDetailPage />}
        />
        <Route path="/user-events/:festId" element={<UserEventPage />} />
        <Route
          path="/manage-requests"
          element={<PrivateRoute element={ManageRequests} role="mainadmin" />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute element={AdminDashboard} />}
        />
        <Route
          path="/add-fest"
          element={<PrivateRoute element={AddFestForm} />}
        />
        <Route
          path="/add-event/:festId"
          element={<PrivateRoute element={AddEventForm} />}
        />
        <Route
          path="/edit-fest/:festId"
          element={<PrivateRoute element={EditFestForm} />}
        />
        <Route
          path="/edit-event/:festId/:eventId"
          element={<PrivateRoute element={EditEventForm} />}
        />
        <Route
          path="/fests/:festId"
          element={<PrivateRoute element={FestEventsPage} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
