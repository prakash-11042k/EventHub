import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected User Pages
import MyRegistrationsPage from '../pages/MyRegistrationsPage';
import ProfilePage from '../pages/ProfilePage';

// Protected Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* User Authenticated Routes */}
        <Route
          path="my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Authenticated Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/events"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ManageEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <ManageCategoriesPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
