import Layout from "@/components/ui/layout";
import { ListBorrow } from "./ListBorrow";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useUserBorrow } from "@/context/UsersContext";

const BorrowBook = () => {
   const { isLoadingUsers } = useUserBorrow();
   const menus = [
      {
         label: "Borrow Book",
         active: true,
      },
   ];

   if (isLoadingUsers) {
      return <ListSkeleton />;
   }

   return (
      <Layout borrow submenus={menus}>
         <ListBorrow />
      </Layout>
   );
};

export default BorrowBook;
