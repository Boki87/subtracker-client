import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Layout from "./components/app/Layout";
import RequireAuth from "./components/RequireAuth";
import useAppTheme from "./hooks/useAppTheme";

function App() {
  const { initTheme } = useAppTheme();
  useEffect(() => {
    initTheme();
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
