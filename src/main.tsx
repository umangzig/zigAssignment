import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/variables.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2a52be" },
    secondary: { main: "#6b7280" },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 575,
      md: 767,
      lg: 991,
      xl: 1199,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
