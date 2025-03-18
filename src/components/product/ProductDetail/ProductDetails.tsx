import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Rating,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  Divider,
} from "@mui/material";
import { Product } from "../../../types/product";
import { getProductById } from "../../../utils/products.api";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
        }
      } catch (err) {
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  };

  const handleAddToCart = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false); 
    }, 2000);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" textAlign="center" mt={4}>
          Product not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                maxHeight: 400,
                display: "flex",
                justifyContent: "center",
              }}>
              <img
                src={product.thumbnail}
                alt={product.title}
                onLoad={() => handleImageLoad(product.thumbnail)}
                style={{
                  width: "100%",
                  objectFit: "contain",
                  filter: loadedImages.has(product.thumbnail)
                    ? "none"
                    : "blur(8px)",
                  transition: "filter 0.3s ease-in-out",
                }}
              />
            </Box>

            <ImageList cols={4} gap={8} sx={{ mt: 2 }}>
              {product.images?.map((img, index) => (
                <ImageListItem key={index}>
                  <img
                    src={img}
                    alt={`${product.title} - ${index}`}
                    onLoad={() => handleImageLoad(img)}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      borderRadius: 8,
                      filter: loadedImages.has(img) ? "none" : "blur(8px)",
                      transition: "filter 0.3s ease-in-out",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            <Rating
              value={product.rating}
              readOnly
              precision={0.5}
              sx={{ my: 1 }}
            />

            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
              ${product.price}
              <Typography component="span" color="error" sx={{ ml: 1 }}>
                (-{product.discountPercentage}%)
              </Typography>
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Category:</strong> {product.category}
            </Typography>
            <Typography variant="body2">
              <strong>Brand:</strong> {product.brand}
            </Typography>
            <Typography variant="body2">
              <strong>Stock:</strong> {product.availabilityStatus}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleAddToCart}
              sx={{
                width: "100%",
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
              }}>
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/products", { replace: true })}
              sx={{
                width: "100%",
                my: 2,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
              }}>
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Product added to cart successfully!
          <Typography variant="caption" color="textSecondary">
            (This is a static message, functionality in progress)
          </Typography>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails;

