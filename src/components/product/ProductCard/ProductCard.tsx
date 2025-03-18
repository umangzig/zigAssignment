import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ProductCardProps } from "../../../types/productCard";
import { useState } from "react";

const ProductCard = ({ product }: ProductCardProps) => {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set()); 
  
  const navigate = useNavigate();
    const handleImageLoad = (imageUrl: string) => {
      setLoadedImages((prev) => new Set(prev).add(imageUrl));
    };
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}>
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnail}
        alt={product.title}
        onLoad={() => handleImageLoad(product.thumbnail)}
        sx={{
          width: "100%",
          objectFit: "contain",
          filter: loadedImages.has(product.thumbnail) ? "none" : "blur(8px)",
          transition: "filter 0.3s ease-in-out",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          sx={{ textDecoration: "none", color: "inherit" }}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.category} | {product.brand}
        </Typography>
        <Rating value={product.rating} readOnly precision={0.5} size="small" />
        <Typography variant="h6">
          ${product.price}
          <Typography component="span" color="error" sx={{ ml: 1 }}>
            (-{product.discountPercentage}%)
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
