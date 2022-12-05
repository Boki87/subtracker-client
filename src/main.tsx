import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CombinedContext from "./context";
import "./index.css";
import AppConfirmBox from "./components/ui/AppConfirmBox";
import CategoryModal from "./components/app/CategoryModal";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <CombinedContext>
        <App />
        <AppConfirmBox />
        <CategoryModal />
      </CombinedContext>
    </BrowserRouter>
  </React.StrictMode>
);
