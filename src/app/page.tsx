"use client";

import { Typography } from "@mui/material";
import { ProductInfoDialog } from "@root/components/product-info-dialog/product-info-dialog";
import { ProductList } from "@root/components/product-list/product-list";
import { useState } from "react";

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  return (
    <main className="flex flex-col items-center justify-between">
      <Typography variant="h4" gutterBottom>
        Externt API
      </Typography>
      <Typography>
        Den här sidan demonstrerar hur företag kan samarbeta med Eskitech genom
        att tillåtas hämta produktdata från Eskitechs databas genom ett API.
      </Typography>
      <Typography>
        Partnern kan endast hämta data och inte skapa, uppdatera eller radera
        data.
      </Typography>
      <ProductList onProductSelected={setSelectedProductId} />
      <ProductInfoDialog
        productId={selectedProductId}
        setProductId={setSelectedProductId}
      />
    </main>
  );
}
