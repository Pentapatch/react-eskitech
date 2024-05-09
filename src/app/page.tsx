"use client";

import { ProductInfoDialog } from "@root/components/product-info-dialog/product-info-dialog";
import { ProductList } from "@root/components/product-list/product-list";
import { useState } from "react";

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  return (
    <main className="flex flex-col items-center justify-between">
      <p>
        Den här sidan demonstrerar hur företag kan samarbeta med Eskitech genom
        att tillåtas hämta produktdata från Eskitechs databas genom ett API.
      </p>
      <p className="pb-4">
        Partnern kan endast hämta data och inte skapa, uppdatera eller radera
        data.
      </p>
      <ProductList onProductSelected={setSelectedProductId} />
      <ProductInfoDialog
        productId={selectedProductId}
        setProductId={setSelectedProductId}
      />
    </main>
  );
}
