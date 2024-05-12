import { Close, Delete, ExpandMore, Save } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "@root/api/api";
import { Categories } from "@root/models/categories/categories";
import { Category } from "@root/models/categories/category";
import { CategoryPost } from "@root/models/categories/category-post";
import { CategoryPut } from "@root/models/categories/category-put";
import { useEffect, useState } from "react";

interface CategoryCrudDialogProps {
  categoryId: number | null | undefined;
  setCategoryId: (categoryId: number | null) => void;
  onRefresh?: () => void;
}

export const CategoryCrudDialog = ({
  categoryId,
  setCategoryId,
  onRefresh,
}: CategoryCrudDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [editedCategory, setEditedCategory] = useState<
    CategoryPut | CategoryPost | null
  >(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState<Categories[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (categoryId === null) {
      setOpen(false);
      return;
    } else if (categoryId === undefined) {
      setOpen(true);
      setEditedCategory({} as CategoryPost);
      return;
    }

    setLoading(true);
    setOpen(true);

    getCategory(categoryId)
      .then((data) => {
        setCategory(data);
        setEditedCategory(data);
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching category:", error);
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  useEffect(() => {
    if (!open) {
      setCategory(null);
      setCategoryId(null);
      setEditedCategory(null);
    }
  }, [open, setCategoryId]);

  const getDate = (date: string | undefined): string =>
    date ? new Date(date).toUTCString() : "-";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCategory((prevState) => ({
      ...(prevState as CategoryPut | CategoryPost),
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    if (category) {
      setDeleteInProgress(true);
      deleteCategory(category.id)
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
    if (category && editedCategory) {
      setSubmitInProgress(true);
      updateCategory(category.id, editedCategory)
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
    } else if (editedCategory) {
      setSubmitInProgress(true);
      createCategory(editedCategory)
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
          {(category && `Redigera kategori #${category.id}`) ||
            (loading && (
              <div className="flex items-center gap-4">
                <CircularProgress />
                Laddar kategori...
              </div>
            )) ||
            "Skapa ny produkt"}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="mt-2 flex flex-col gap-4">
          <TextField
            label="Namn"
            id="name"
            name="name"
            value={editedCategory?.name || ""}
            onChange={handleInputChange}
            disabled={requestInProgress}
            fullWidth
          />
          {category && (
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
                    value={category?.id || ""}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Skapad datum"
                    value={getDate(category?.createdAt)}
                    fullWidth
                    disabled
                  />
                  <TextField
                    label="Uppdaterad datum"
                    value={getDate(category?.updatedAt)}
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
          {category && (
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
              {category ? "Spara ändringar" : "Skapa kategori"}
            </div>
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
