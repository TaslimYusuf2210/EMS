import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
import CreateAccount from "./pages/auth/CreateAccount";
import Dashboard from "./pages/dashboard/Dashboard";
import DepartmentDetails from "./pages/departments/DepartmentDetails";
import DepartmentsList from "./pages/departments/DepartmentsList";
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import EmployeesList from "./pages/employees/EmployeesList";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <Routes>
          {/* Auth routes (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* App routes (with sidebar layout + auth protection) */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeesList />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="departments" element={<DepartmentsList />} />
            <Route path="departments/:id" element={<DepartmentDetails />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
      </QueryClientProvider>
  );
}

export default App;
