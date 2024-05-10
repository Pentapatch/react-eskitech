"use client";

import { Typography } from "@mui/material";
import { ProductCrudDialog } from "@root/components/product-crud-dialog/product-crud-dialog";
import { ProductList } from "@root/components/product-list/product-list";
import { useState } from "react";

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  return (
    <main className="flex flex-col items-center justify-between">
      <Typography variant="h4" gutterBottom>
        Intern CRUD
      </Typography>
      <Typography>
        Den här sidan demonstrerar hur Eskitech skulle kunna nyttja APIet för
        att skriva en intern CRUD-applikation som kan hämta, skapa, uppdatera
        och radera produkter från databasen.
      </Typography>
      <ProductList onProductSelected={setSelectedProductId} />
      <ProductCrudDialog
        productId={selectedProductId}
        setProductId={setSelectedProductId}
      />
    </main>
  );
}
