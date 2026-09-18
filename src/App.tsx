import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Costs from "./pages/Costs";
import Infrastructure from "./pages/Infrastructure";
import Security from "./pages/Security";
import NetworkPage from "./pages/Network";
import Services from "./pages/Services";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        {/* ml-64 compensa el ancho fijo del sidebar (w-64) */}
        <main className="ml-64 flex-1 p-8 min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/costs" element={<Costs />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/security" element={<Security />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}