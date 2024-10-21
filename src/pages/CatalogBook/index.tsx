import Layout from "@/components/ui/layout";
import { ListBook } from "./ListBook";
import { useBooks } from "@/context/BooksContext";
import { ListSkeleton } from "@/components/ui/skeleton";

const CatalogBook = () => {
   const { isLoadingBooks } = useBooks();
   const menus = [
      {
         label: "Catalog Book",
         active: true,
      },
   ];

   if (isLoadingBooks) {
      return <ListSkeleton />;
   }

   return (
      <Layout create submenus={menus}>
         <ListBook />
      </Layout>
   );
};

export default CatalogBook;
