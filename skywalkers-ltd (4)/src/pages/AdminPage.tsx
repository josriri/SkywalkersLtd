import { useAuth } from "../lib/auth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export function AdminPage() {
  const { token } = useAuth();
  return token ? <AdminDashboard /> : <AdminLogin />;
}
