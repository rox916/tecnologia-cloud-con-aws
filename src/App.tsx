import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CloudDataProvider } from "./context/CloudDataContext";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Costs from "./pages/Costs";
import Infrastructure from "./pages/Infrastructure";
import Security from "./pages/Security";
import NetworkPage from "./pages/Network";
import Services from "./pages/Services";
import NotificationCenter from "./components/ui/NotificationCenter";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <CloudDataProvider>
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="ml-0 lg:ml-64 flex-1 p-4 sm:p-6 lg:p-8 min-h-screen bg-background page-enter">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/costs" element={<Costs />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/security" element={<Security />} />
              <Route path="/network" element={<NetworkPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <NotificationCenter />
        </div>
      </BrowserRouter>
    </CloudDataProvider>
  );
}

function NotFound() {
  return <div className="min-h-[60vh] flex items-center justify-center"><div className="bg-card border border-border rounded-card shadow-card p-8 text-center max-w-md"><p className="text-xs uppercase tracking-wide text-primary font-semibold">404</p><h1 className="text-2xl font-bold text-text-primary mt-2">Página no encontrada</h1><p className="text-sm text-text-secondary mt-2 mb-5">La sección que buscas no existe o cambió de ubicación.</p><Link to="/dashboard" className="inline-flex bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Volver al dashboard</Link></div></div>;
}