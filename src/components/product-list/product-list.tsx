"use client";

import { Add, Delete, Update } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControlLabel,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  deleteProduct,
  getProducts,
  getProductsPaginated,
} from "@root/api/api";
import { Products } from "@root/models/products/products";
import { useEffect, useState } from "react";

interface ProductListProps {
  crud?: boolean;
  refresh?: boolean;
  onProductSelected: (productId: number | null) => void;
  onCreateProduct?: () => void;
}

export const ProductList = ({
  crud,
  refresh,
  onProductSelected,
  onCreateProduct,
}: ProductListProps) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showRawData, setShowRawData] = useState<boolean>(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);

  const pageSize = 10;

  const fetchProducts = async () => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setJsonResponse(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching products:", error);
      });
  };

  const fetchProductsPaginated = async (page: number, size: number) => {
    getProductsPaginated(page, size)
      .then((data) => {
        console.log("data", data);
        setProducts(data.data);
        setPage(data.page);
        setTotalCount(data.totalCount);
        setJsonResponse(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching products:", error);
      });
  };

  useEffect(() => {
    if (!crud) fetchProducts();
    else fetchProductsPaginated(page, pageSize);
  }, [refresh, crud, page]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowRawData(event.target.checked);
  };

  const handleCreateProduct = () => {
    if (onCreateProduct) onCreateProduct();
  };

  const handleDelete = async (productId: number) => {
    setDeleteInProgress(true);
    deleteProduct(productId)
      .catch((error) => {
        console.error("Error deleting product:", error);
      })
      .finally(() => {
        setDeleteInProgress(false);
        fetchProducts();
      });
  };

  const handleRefresh = () => {
    if (!crud) fetchProducts();
    else fetchProductsPaginated(page, pageSize);
  };

  const autocompleteOptions = products.map((product) => ({
    label: product.name,
    id: product.id,
  }));

  if (loading) {
    return (
      <div className="mt-6">
        <CircularProgress size={48} />
      </div>
    );
  }

  return (
    <div className="w-full my-4">
      <div className="sticky top-[110px] h-20 px-2 bg-blue-50 flex items-center justify-between z-10 shadow-sm">
        <h1 className="pl-2 font-bold text-2xl">Produkter</h1>
        <Autocomplete
          disablePortal
          options={autocompleteOptions}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Sök i listan" />
          )}
          noOptionsText="Inga produkter hittades"
          onChange={(_, selectedOption) => {
            onProductSelected(selectedOption?.id || null);
          }}
        />
        <div className="flex gap-4">
          <FormControlLabel
            control={<Switch checked={showRawData} onChange={handleChange} />}
            label="Visa rå data"
          />
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<Update />}
          >
            Uppdatera
          </Button>
          {crud && (
            <Button
              variant="contained"
              onClick={handleCreateProduct}
              startIcon={<Add />}
            >
              Skapa ny produkt
            </Button>
          )}
        </div>
      </div>
      {(showRawData && (
        <pre className="py-2 text-xs sm:text-sm overflow-auto">
          {jsonResponse}
        </pre>
      )) || (
        <TableContainer component={Paper} className="mt-4">
          <Table sx={{ minWidth: 650 }} aria-label="product table">
            <TableHead>
              <TableRow>
                <TableCell>Namn</TableCell>
                <TableCell align="left">Tillverkare</TableCell>
                <TableCell align="left">Beskrivning</TableCell>
                <TableCell align="left">Kategori</TableCell>
                <TableCell align="left">Pris</TableCell>
                <TableCell align="left">Lagersaldo</TableCell>
                {crud && <TableCell align="left">Åtgärder</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product.name}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "inherit",
                  }}
                >
                  <TableCell component="th" scope="row">
                    <a href="#" onClick={() => onProductSelected(product.id)}>
                      {product.name}
                    </a>
                  </TableCell>
                  <TableCell align="left">{product.brand}</TableCell>
                  <TableCell align="left">{product.description}</TableCell>
                  <TableCell align="left">
                    {product.category.displayName}
                  </TableCell>
                  <TableCell align="right">{product.price}</TableCell>
                  <TableCell align="right">{product.stockQuantity}</TableCell>
                  {crud && (
                    <TableCell align="right">
                      <Button
                        color="warning"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteInProgress}
                      >
                        {deleteInProgress ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Delete />
                        )}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {crud && (
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              className="py-4"
            />
          )}
        </TableContainer>
      )}
    </div>
  );
};
