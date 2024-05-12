"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { CategoryList } from "@root/components/category-list/category-list";
import { CategoryCrudDialog } from "@root/components/crud-dialog/category-crud-dialog/category-crud-dialog";
import { ProductCrudDialog } from "@root/components/crud-dialog/product-crud-dialog/product-crud-dialog";
import { ProductList } from "@root/components/product-list/product-list";
import { useState } from "react";

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<
    number | null | undefined
  >(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | null | undefined
  >(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <Typography variant="h4" gutterBottom>
        CRUD Applikation
      </Typography>
      <Typography className="mb-4">
        Den här sidan demonstrerar hur Eskitech skulle kunna nyttja APIet för
        att skriva en intern CRUD-applikation som kan hämta, skapa, uppdatera
        och radera produkter från databasen.
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={(_, value) => setCurrentTab(value)}
            aria-label="basic tabs example"
          >
            <Tab label="Produkter" {...tabProps(0)} />
            <Tab label="Kategorier" {...tabProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={currentTab} index={0}>
          <ProductList
            onProductSelected={setSelectedProductId}
            onCreateProduct={() => setSelectedProductId(undefined)}
            crud
            refresh={refresh}
          />
        </CustomTabPanel>
        <CustomTabPanel value={currentTab} index={1}>
          <CategoryList
            onCategorySelected={setSelectedCategoryId}
            onCreateCategory={() => setSelectedCategoryId(undefined)}
            refresh={refresh}
          />
        </CustomTabPanel>
      </Box>
      <ProductCrudDialog
        productId={selectedProductId}
        setProductId={setSelectedProductId}
        onRefresh={() => setRefresh((prev) => !prev)}
      />
      <CategoryCrudDialog
        categoryId={selectedCategoryId}
        setCategoryId={setSelectedCategoryId}
        onRefresh={() => setRefresh((prev) => !prev)}
      />
    </main>
  );
}
