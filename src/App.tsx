import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Signup from "./components/auth/SignUp/Signup";
import EditProfile from "./components/profile/EditProfile/EditProfile";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";
import { isAuthenticated } from "./utils/auth";
import ProductList from "./components/product/ProductList/ProductList";
import ProductDetails from "./components/product/ProductDetail/ProductDetails";
import Login from "./components/auth/Login/Login";
import ChangePassword from "./components/profile/ChangePassword/ChangePassword";
import NotFound from "./components/common/NotFound/NotFound";
import { Box, Container } from "@mui/material";
import "../src/index.css";
import Cart from "./components/product/Cart/Cart";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogoutSuccess = () => {
    setAuthenticated(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "space-between",
      }}>
      {authenticated && <Header onLogoutSuccess={handleLogoutSuccess} />}
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
          "&.MuiContainer-root": {
            maxWidth: "none ",
            margin: "0",
            padding: "0",
          },
        }}>
        <Routes>
          <Route
            path="/signup"
            element={
              <ProtectedRoute redirectWhenAuthenticated>
                <Signup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectWhenAuthenticated>
                <Login onLoginSuccess={handleLoginSuccess} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      {authenticated && <Footer />}
    </Box>
  );
}

export default App;
