import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import StudentsPage from "@/pages/Students";
import StaffPage from "@/pages/Staff";
import AttendancePage from "@/pages/Attendance";
import AcademicsPage from "@/pages/Academics";
import TimetablePage from "@/pages/Timetable";
import AssignmentsPage from "@/pages/Assignments";
import FeesPage from "@/pages/Fees";
import FinancePage from "@/pages/Finance";
import LibraryPage from "@/pages/Library";
import TransportPage from "@/pages/Transport";
import InventoryPage from "@/pages/Inventory";
import DisciplinePage from "@/pages/Discipline";
import CommunicationPage from "@/pages/Communication";
import EventsPage from "@/pages/Events";
import MaterialsPage from "@/pages/Materials";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";

const queryClient = new QueryClient();

const LoginRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/academics" element={<AcademicsPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/fees" element={<FeesPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/discipline" element={<DisciplinePage />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
