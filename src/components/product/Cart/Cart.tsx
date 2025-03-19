import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeFromCart, updateQuantity } from "../../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity >= 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const calculateItemPrices = (item: typeof cartItems[0]) => {
    const originalPrice = item.price;
    const discountMultiplier = item.discountPercentage
      ? 1 - item.discountPercentage / 100
      : 1;
    const discountedPrice = originalPrice * discountMultiplier;
    return {
      original: (originalPrice * item.quantity).toFixed(2),
      discounted: (discountedPrice * item.quantity).toFixed(2),
      savings: ((originalPrice - discountedPrice) * item.quantity).toFixed(2),
    };
  };

  const calculateCartTotals = () => {
    const totals = cartItems.reduce(
      (acc, item) => {
        const prices = calculateItemPrices(item);
        acc.original += parseFloat(prices.original);
        acc.discounted += parseFloat(prices.discounted);
        return acc;
      },
      { original: 0, discounted: 0 }
    );
    return {
      original: totals.original.toFixed(2),
      discounted: totals.discounted.toFixed(2),
      savings: (totals.original - totals.discounted).toFixed(2),
    };
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "grey.500" }} />
          <Typography variant="h4" gutterBottom sx={{ mt: 2, fontWeight: "bold" }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything yet. Start shopping now!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/products")}
            sx={{ borderRadius: 8, px: 4, py: 1.5 }}>
            Shop Now
          </Button>
        </Paper>
      </Container>
    );
  }

  const totals = calculateCartTotals();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            {cartItems.map((item) => {
              const prices = calculateItemPrices(item);
              return (
                <React.Fragment key={item.id}>
                  <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                    <Grid item xs={4} sm={2}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          objectFit: "cover",
                          maxHeight: 100,
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} sm={4}>
                      <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.brand}
                      </Typography>
                      {item.discountPercentage && (
                        <Typography variant="body2" color="success.main">
                          {item.discountPercentage}% Off
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{ bgcolor: "grey.200", "&:hover": { bgcolor: "grey.300" } }}>
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ minWidth: 30, textAlign: "center" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          sx={{ bgcolor: "grey.200", "&:hover": { bgcolor: "grey.300" } }}>
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        ${prices.discounted}
                      </Typography>
                      {item.discountPercentage && (
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                          ${prices.original}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={2} sm={1}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{ "&:hover": { bgcolor: "error.light" } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              );
            })}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: "grey.50" }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Order Summary
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${totals.original}</Typography>
              </Box>
              {totals.savings !== "0.00" && (
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1" color="success.main">
                    Discount
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    -${totals.savings}
                  </Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1" color="text.secondary">
                  Calculated at checkout
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${totals.discounted}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ borderRadius: 8, py: 1.5, mt: 2 }}>
                Proceed to Checkout
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={() => navigate("/products")}
                sx={{ borderRadius: 8, py: 1.5 }}>
                Continue Shopping
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;