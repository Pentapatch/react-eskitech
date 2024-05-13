import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getProduct } from "@root/api/api";
import { Product } from "@root/models/products/product";
import { useEffect, useState } from "react";

interface ProductInfoDialogProps {
  productId: number | null;
  setProductId: (productId: number | null) => void;
}

export const ProductInfoDialog = ({
  productId,
  setProductId,
}: ProductInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!productId) {
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    getProduct(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching product:", error);
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!open) {
      setProduct(null);
      setProductId(null);
    }
  }, [open, setProductId]);

  const getDate = (date: string | undefined): string =>
    date ? new Date(date).toUTCString() : "-";

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between">
          {(product && "Produktinformation") ||
            (loading && (
              <div className="flex items-center gap-4">
                <CircularProgress />
                Laddar produkt...
              </div>
            ))}
          <Button onClick={handleClose} startIcon={<Close />}>
            Stäng
          </Button>
        </div>
      </DialogTitle>
      {product && (
        <List dense>
          <ListItem>
            <ListItemText primary="Produktnamn" secondary={product.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Databas ID" secondary={product.id} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Produkt ID" secondary={product.productId} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Beskrivning"
              secondary={product.description}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Lång beskrivning"
              secondary={product.longDescription}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Tillverkare" secondary={product.brand} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Kategori ID"
              secondary={product.category.id}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Kategori namn"
              secondary={product.category.displayName}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Pris" secondary={product.price} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Lagersaldo"
              secondary={product.stockQuantity}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Skapad datum"
              secondary={getDate(product.createdAt)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Uppdaterad datum"
              secondary={getDate(product.updatedAt)}
            />
          </ListItem>
        </List>
      )}
    </Dialog>
  );
};
