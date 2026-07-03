import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { PublicLayout } from "./components/PublicLayout";
import { AuthProvider } from "./lib/auth";
import { Home } from "./pages/Home";
import { DigitizeBiz } from "./pages/DigitizeBiz";
import { CitizenEase } from "./pages/CitizenEase";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/digitizebiz" element={<DigitizeBiz />} />
              <Route path="/citizenease" element={<CitizenEase />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
