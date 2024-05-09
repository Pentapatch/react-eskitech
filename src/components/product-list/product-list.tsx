"use client";

import {
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
} from "@mui/material";
import { ProductDialog } from "@root/components/product-dialog/product-dialog";
import { Products } from "@root/models/products/products";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProductList = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showRawData, setShowRawData] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

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
        <FormControlLabel
          control={<Switch checked={showRawData} onChange={handleChange} />}
          label="Visa rå data"
        />
      </div>
      {(showRawData && (
        <pre className="py-2 text-xs overflow-scroll">{jsonResponse}</pre>
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
                    <a
                      href="#"
                      onClick={() => setSelectedProductId(product.id)}
                    >
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
      <ProductDialog
        productId={selectedProductId}
        setProductId={setSelectedProductId}
      />
    </div>
  );
};
