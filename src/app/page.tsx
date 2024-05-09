import { ProductList } from "@root/components/product-list/product-list";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <p className="pb-4">
        Den här sidan demonstrerar hur företag kan samarbeta med Eskitech genom
        att tillåtas hämta produktdata från Eskitechs databas genom ett API.
      </p>
      <ProductList />
    </main>
  );
}
