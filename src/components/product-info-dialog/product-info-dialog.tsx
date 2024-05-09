import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Product } from "@root/models/products/product";
import axios from "axios";
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
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7007/api/Products/${productId}`
        );
        setProduct(response.data);
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
    }
  }, [open, setProductId]);

  const getDate = (date: string | undefined): string =>
    date ? new Date(date).toUTCString() : "-";

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <div className="flex items-center justify-between">
          {(product && "Produktinformation") ||
            (loading && (
              <div className="flex items-center gap-4">
                <CircularProgress />
                Laddar produkt...
              </div>
            ))}
          <Button onClick={handleClose}>Stäng</Button>
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
            <ListItemText primary="Märke" secondary={product.brand} />
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
