import React from "react";
import { createRoot } from "react-dom/client";
import FocusMirror from "./FocusMirror.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FocusMirror />
  </React.StrictMode>
);
