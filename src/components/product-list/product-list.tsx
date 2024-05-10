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
import { getProducts } from "@root/api/api";
import { Products } from "@root/models/products/products";
import { useEffect, useState } from "react";

interface ProductListProps {
  onProductSelected: (productId: number | null) => void;
}

export const ProductList = ({ onProductSelected }: ProductListProps) => {
  const [products, setProducts] = useState<Products[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showRawData, setShowRawData] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowRawData(event.target.checked);
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
      <div className="sticky top-[128px] h-20 bg-blue-50 flex items-center justify-between">
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
