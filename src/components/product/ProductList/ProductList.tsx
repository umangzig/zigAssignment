import { useState, useEffect } from "react";
import {
  Grid,
  Pagination,
  Container,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { Product, ProductResponse } from "../../../types/product";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "../../../utils/products.api";
import ProductCard from "../ProductCard/ProductCard";
import useDebounce from "../../common/useDebounce/useDebounce";
import { Toast } from "../../common/Toast/Toast";
import { VALIDATION_MESSAGES } from "../../../constants/message";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categories, setCategories] = useState<{ slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const limit: number = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let response: ProductResponse = { products: [], total: 0 };

        if (debouncedSearch) {
          response = await searchProducts(
            debouncedSearch,
            (page - 1) * limit,
            limit
          );
        } else if (selectedCategory) {
          response = await getProductsByCategory(
            selectedCategory,
            (page - 1) * limit,
            limit
          );
        } else {
          response = await getProducts((page - 1) * limit, limit);
        }

        setProducts(response.products || []);
        setTotal(response.total || 0);
      } catch (err) {
        setError(VALIDATION_MESSAGES.FAIL_TO_FETCH_PRODUCT);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, selectedCategory, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (err) {
        setError(VALIDATION_MESSAGES.FAIL_TO_FETCH_CATEGORY);
      }
    };

    fetchCategories();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPage(1);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            justifyContent: "space-between",
          }}>
          <TextField
            label="Search Products"
            disabled={loading || products.length === 0}
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: { xs: "80%", sm: "auto" },
              width: { xs: "80%", sm: "auto" },
            }}
          />
          <FormControl
            sx={{
              flex: { xs: "20%", sm: "auto" },
              minWidth: { xs: "20%", sm: 200 },
            }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              labelId="category-label"
              disabled={loading || products.length === 0}
              label="Category"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                },
              }}>
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.slug} value={category.slug}>
                  {category.slug ? category.slug : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            disabled={loading || products.length === 0}
            onClick={handleClearFilters}
            sx={{
              height: 56,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            Clear Filters
          </Button>
        </Box>

        <Toast
          open={!!error}
          message={error}
          severity="error"
          autoHideDuration={1000}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {products.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                No products found.
              </Typography>
            ) : (
              <>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {products &&
                    products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={product?.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    size="large"
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProductList;
