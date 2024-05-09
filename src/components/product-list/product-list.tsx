"use client";

import {
  Autocomplete,
  CircularProgress,
  FormControlLabel,
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
import { Products } from "@root/models/products/products";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProductListProps {
  onProductSelected: (productId: number | null) => void;
  onRefresh?: () => void;
}

export const ProductList = ({
  onProductSelected,
  onRefresh,
}: ProductListProps) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showRawData, setShowRawData] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://localhost:7007/api/Products");
        setProducts(response.data);
        setJsonResponse(JSON.stringify(response.data, null, 2));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowRawData(event.target.checked);
  };

  const autocompleteOptions = products.map((product) => ({
    label: product.name,
    id: product.id,
  }));

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="w-full">
      <div className="sticky top-[128px] h-20 bg-gray-100 flex items-center justify-between">
        <h1 className="pl-2 font-bold text-2xl">Eskitech&apos;s produkter</h1>
        <Autocomplete
          disablePortal
          options={autocompleteOptions}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Sök efter produkt" />
          )}
          noOptionsText="Inga produkter hittades"
          onChange={(_, selectedOption) => {
            onProductSelected(selectedOption?.id || null);
          }}
        />
        <FormControlLabel
          control={<Switch checked={showRawData} onChange={handleChange} />}
          label="Visa rå data"
        />
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
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                  <TableCell align="left">{product.price}</TableCell>
                  <TableCell align="left">{product.stockQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
