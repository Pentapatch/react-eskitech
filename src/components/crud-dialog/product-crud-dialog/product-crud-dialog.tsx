import { Close, Delete, ExpandMore, Save } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProduct,
  updateProduct,
} from "@root/api/api";
import { Categories } from "@root/models/categories/categories";
import { Product } from "@root/models/products/product";
import { ProductPost } from "@root/models/products/product-post";
import { ProductPut } from "@root/models/products/product-put";
import { useEffect, useState } from "react";

interface ProductCrudDialogProps {
  productId: number | null | undefined;
  setProductId: (productId: number | null) => void;
  onRefresh?: () => void;
}

export const ProductCrudDialog = ({
  productId,
  setProductId,
  onRefresh,
}: ProductCrudDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<
    ProductPut | ProductPost | null
  >(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (productId === null) {
      setOpen(false);
      return;
    } else if (productId === undefined) {
      setOpen(true);
      setEditedProduct({} as ProductPost);
      return;
    }

    setLoading(true);
    setOpen(true);

    getProduct(productId)
      .then((data) => {
        setProduct(data);
        setEditedProduct({
          ...data,
          categoryId: data.category.id,
        });
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching product:", error);
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });

    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
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
      ...(prevState as ProductPut | ProductPost),
      [name]: value,
    }));
  };

  const handleCategoryChange = (
    selectedOption: { label: string; id: number } | null
  ) => {
    if (!selectedOption) return;
    setEditedProduct((prevState) => ({
      ...(prevState as ProductPut | ProductPost),
      categoryId: selectedOption.id,
    }));
  };

  const handleDelete = async () => {
    if (product) {
      setDeleteInProgress(true);
      deleteProduct(product.id)
        .then(() => {
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        })
        .finally(() => {
          setDeleteInProgress(false);
          if (onRefresh) onRefresh();
        });
    }
  };

  const handleSubmit = async () => {
    if (product && editedProduct) {
      setSubmitInProgress(true);
      updateProduct(product.id, editedProduct)
        .then(() => {
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        })
        .finally(() => {
          setSubmitInProgress(false);
          if (onRefresh) onRefresh();
        });
    } else if (editedProduct) {
      setSubmitInProgress(true);
      createProduct(editedProduct)
        .then(() => {
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error creating product:", error);
        })
        .finally(() => {
          setSubmitInProgress(false);
          if (onRefresh) onRefresh();
        });
    }
  };

  const autocompleteOptions = categories.map((category) => ({
    label: category.name,
    id: category.id,
  }));

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
            )) ||
            "Skapa ny produkt"}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="mt-2 flex flex-col gap-4">
          <TextField
            label="Produktnamn"
            id="product-name"
            name="name"
            value={editedProduct?.name || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          <TextField
            label="Produkt ID"
            id="product-id"
            name="productId"
            value={editedProduct?.productId || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          <TextField
            label="Beskrivning"
            id="product-description"
            name="description"
            value={editedProduct?.description || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            multiline
            fullWidth
          />
          <TextField
            label="Lång beskrivning"
            id="product-long-description"
            name="longDescription"
            value={editedProduct?.longDescription || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            multiline
            fullWidth
          />
          <TextField
            label="Tillverkare"
            id="product-brand"
            name="brand"
            value={editedProduct?.brand || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          <Autocomplete
            disablePortal
            options={autocompleteOptions}
            renderInput={(params) => <TextField {...params} label="Kategori" />}
            noOptionsText="Inga matchande kategorier hittades"
            value={
              autocompleteOptions.find(
                (x) => x.id === editedProduct?.categoryId
              ) || null
            }
            onChange={(_, selectedOption) => {
              handleCategoryChange(selectedOption);
            }}
          />
          <TextField
            label="Pris"
            id="product-price"
            name="price"
            value={editedProduct?.price || ""}
            type="number"
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          <TextField
            label="Lagersaldo"
            id="product-stock-quantity"
            name="stockQuantity"
            type="number"
            value={editedProduct?.stockQuantity || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          {product && (
            <Accordion
              expanded={expanded}
              onChange={(_, expanded) => setExpanded(expanded)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Låsta fält</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col gap-4">
                  <TextField
                    label="Databas ID"
                    value={product?.id || ""}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Skapad datum"
                    value={getDate(product?.createdAt)}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Uppdaterad datum"
                    value={getDate(product?.updatedAt)}
                    fullWidth
                    disabled
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
      </DialogContent>
      {!loading && (
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={requestInProgress}
            startIcon={<Close />}
          >
            Avbryt
          </Button>
          {product && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleDelete}
              disabled={requestInProgress}
              startIcon={<Delete />}
            >
              <div className="flex items-center gap-4">
                {deleteInProgress && <CircularProgress size={24} />}
                Radera
              </div>
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={requestInProgress}
            startIcon={<Save />}
          >
            <div className="flex items-center gap-4">
              {submitInProgress && <CircularProgress size={24} />}
              {product ? "Spara ändringar" : "Skapa produkt"}
            </div>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
