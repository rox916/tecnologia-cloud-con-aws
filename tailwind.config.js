/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        sidebar: "#0F172A",
        primary: "#2563EB",
        security: "#16A34A",
        cost: "#F59E0B",
        alert: "#DC2626",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        border: "#E2E8F0",
        card: "#FFFFFF",
      },
      borderRadius: {
        card: "14px", // dentro del rango 12–16px pedido
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08)", // sombra ligera
      },
    },
  },
  plugins: [],
};