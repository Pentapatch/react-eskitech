import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Product } from "@root/models/products/product";
import { ProductPut } from "@root/models/products/product-put";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProductCrudDialogProps {
  productId: number | null;
  setProductId: (productId: number | null) => void;
}

export const ProductCrudDialog = ({
  productId,
  setProductId,
}: ProductCrudDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<ProductPut | null>(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7007/api/Products/${productId}`
        );
        setProduct(response.data);
        setEditedProduct({
          ...response.data,
          categoryId: response.data.category.id,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      setLoading(true);
      setOpen(true);
      fetchProduct();
    } else {
      setOpen(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!open) {
      setProduct(null);
      setProductId(null);
      setEditedProduct(null);
    }
  }, [open, setProductId]);

  const getDate = (date: string | undefined): string =>
    date ? new Date(date).toUTCString() : "-";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProduct((prevState) => ({
      ...(prevState as ProductPut),
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    if (product) {
      setDeleteInProgress(true);
      try {
        await axios.delete(`https://localhost:7007/api/Products/${product.id}`);
        setOpen(false);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
      setDeleteInProgress(false);
    }
  };

  const handleSubmit = async () => {
    if (product && editedProduct) {
      setSubmitInProgress(true);
      try {
        await axios.put(
          `https://localhost:7007/api/Products/${product.id}`,
          editedProduct
        );
        setOpen(false);
      } catch (error) {
        console.error("Error updating product:", error);
      }
      setSubmitInProgress(false);
    }
  };

  const requestInProgress = submitInProgress || deleteInProgress;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleSubmit();
        },
      }}
    >
      <DialogTitle>
        <div className="flex items-center justify-between">
          {(product && `Redigera produkt #${product.id}`) ||
            (loading && (
              <div className="flex items-center gap-4">
                <CircularProgress />
                Laddar produkt...
              </div>
            ))}
        </div>
      </DialogTitle>
      <DialogContent>
        {editedProduct && (
          <div className="mt-2 flex flex-col gap-4">
            <TextField
              label="Produktnamn"
              id="product-name"
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              disabled={requestInProgress}
              fullWidth
            />
            {product && (
              <TextField
                label="Databas ID"
                value={product.id}
                onChange={handleInputChange}
                fullWidth
                disabled
              />
            )}
            <TextField
              label="Produkt ID"
              id="product-id"
              name="productId"
              value={editedProduct.productId}
              onChange={handleInputChange}
              disabled={requestInProgress}
              fullWidth
            />
            <TextField
              label="Beskrivning"
              id="product-description"
              name="description"
              value={editedProduct.description}
              onChange={handleInputChange}
              disabled={requestInProgress}
              multiline
              fullWidth
            />
            <TextField
              label="Märke"
              id="product-brand"
              name="brand"
              value={editedProduct.brand}
              onChange={handleInputChange}
              disabled={requestInProgress}
              fullWidth
            />
            {/* TODO: Implement when I have endpoints for gettings all categories */}
            {/* <FormControl fullWidth>
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                label="Kategori"
                id="product-category-id"
                name="categoryId"
                labelId="category-label"
                value={product.category.displayName}
                fullWidth
                onChange={() => {}}
              >
                <MenuItem value={"Cyckling"}>Cyckling</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl> */}
            <TextField
              label="Pris"
              id="product-price"
              name="price"
              value={editedProduct.price}
              onChange={handleInputChange}
              disabled={requestInProgress}
              fullWidth
            />
            <TextField
              label="Lagersaldo"
              id="product-stock-quantity"
              name="stockQuantity"
              value={editedProduct.stockQuantity}
              onChange={handleInputChange}
              disabled={requestInProgress}
              fullWidth
            />
            {product && (
              <>
                <TextField
                  label="Skapad datum"
                  value={getDate(product.createdAt)}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Uppdaterad datum"
                  value={getDate(product.updatedAt)}
                  fullWidth
                  disabled
                />
              </>
            )}
          </div>
        )}
      </DialogContent>
      {!loading && (
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={requestInProgress}
          >
            Avbryt
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleDelete}
            disabled={requestInProgress}
          >
            <div className="flex items-center gap-4">
              {deleteInProgress && <CircularProgress size={24} />}
              Radera
            </div>
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={requestInProgress}
          >
            <div className="flex items-center gap-4">
              {submitInProgress && <CircularProgress size={24} />}
              Spara
            </div>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
