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
import { deleteCategory, getCategoriesPaginated } from "@root/api/api";
import { Categories } from "@root/models/categories/categories";
import { useEffect, useState } from "react";

interface CategoryListProps {
  refresh?: boolean;
  onCategorySelected: (productId: number | null) => void;
  onCreateCategory?: () => void;
}

export const CategoryList = ({
  refresh,
  onCategorySelected,
  onCreateCategory,
}: CategoryListProps) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showRawData, setShowRawData] = useState<boolean>(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10);

  const pageSize = 10;

  const fetchCategoriesPaginated = async (page: number, size: number) => {
    getCategoriesPaginated(page, size)
      .then((data) => {
        setCategories(data.data);
        setPage(data.page);
        setTotalCount(data.totalCount);
        setJsonResponse(JSON.stringify(data, null, 2));
        setLoading(false);
      })
      .catch((error) => {
        // TODO: Display generic error message to user via a toast or similar
        console.error("Error fetching categories:", error);
      });
  };

  useEffect(() => {
    fetchCategoriesPaginated(page, pageSize);
  }, [refresh, page]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowRawData(event.target.checked);
  };

  const handleCreateCategory = () => {
    if (onCreateCategory) onCreateCategory();
  };

  const handleDelete = async (categoryId: number) => {
    setDeleteInProgress(true);
    deleteCategory(categoryId)
      .catch((error) => {
        console.error("Error deleting category:", error);
      })
      .finally(() => {
        setDeleteInProgress(false);
        fetchCategoriesPaginated(page, pageSize);
      });
  };

  const autocompleteOptions = categories.map((product) => ({
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
        <h1 className="pl-2 font-bold text-2xl">Kategorier</h1>
        <Autocomplete
          disablePortal
          options={autocompleteOptions}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Sök i listan" />
          )}
          noOptionsText="Inga kategorier hittades"
          onChange={(_, selectedOption) => {
            onCategorySelected(selectedOption?.id || null);
          }}
        />
        <div className="flex gap-4">
          <FormControlLabel
            control={<Switch checked={showRawData} onChange={handleChange} />}
            label="Visa rå data"
          />
          <Button
            variant="outlined"
            onClick={() => fetchCategoriesPaginated(page, pageSize)}
            startIcon={<Update />}
          >
            Uppdatera
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCategory}
            startIcon={<Add />}
          >
            Skapa ny kategori
          </Button>
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
                <TableCell align="left">Id</TableCell>
                <TableCell align="right">Åtgärder</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow
                  key={category.name}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: index % 2 === 0 ? "#f2f2f2" : "inherit",
                  }}
                >
                  <TableCell component="th" scope="row">
                    <a href="#" onClick={() => onCategorySelected(category.id)}>
                      {category.name}
                    </a>
                  </TableCell>
                  <TableCell align="left">{category.id}</TableCell>
                  <TableCell align="right">
                    <Button
                      color="warning"
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteInProgress}
                    >
                      {deleteInProgress ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Delete />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={Math.ceil(totalCount / pageSize)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            className="py-4"
          />
        </TableContainer>
      )}
    </div>
  );
};
