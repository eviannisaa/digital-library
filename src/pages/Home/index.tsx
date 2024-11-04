import { useEffect } from "react";
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { HomeSkeleton } from "@/components/ui/skeleton";
import { useBooksStore } from "@/store/useBookStore";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Home = () => {
   const navigate = useNavigate();
   const {
      books,
      isLoadingBooks,
      fetchBooks,
      searchQuery,
      setSearchQuery,
      filterBy,
      setFilterBy,
      handleSearch,
      isSearching,
   } = useBooksStore();

   useEffect(() => {
      fetchBooks();
   }, [fetchBooks]);

   if (isLoadingBooks) {
      return <HomeSkeleton />;
   }

   const getStatusStyles = (status: string) => {
      switch (status) {
         case "Available":
            return { text: "text-green-600", bg: "bg-green-600" };
         case "Borrowed":
            return { text: "text-yellow-600", bg: "bg-yellow-600" };
         case "Reserved":
            return { text: "text-red-600", bg: "bg-red-600" };
         default:
            return { text: "text-gray-400", bg: "bg-gray-200" };
      }
   };

   return (
      <Layout cta={true}>
         <div className="flex flex-col gap-y-5">
            <div className="flex flex-row gap-2 md:gap-3 items-center">
               <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
               />
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline">
                        {filterBy ? (
                           <div className="capitalize flex items-center gap-2">
                              {filterBy} <ChevronDownIcon />
                           </div>
                        ) : (
                           "Select..."
                        )}
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => setFilterBy("all")}>
                        All
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterBy("author")}>
                        Author
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterBy("title")}>
                        Title
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterBy("year")}>
                        Year
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterBy("status")}>
                        Status
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterBy("codeBook")}>
                        Code Book
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <Button onClick={handleSearch}>
                  <MagnifyingGlassIcon className="text-xl" />
               </Button>
            </div>

            <div>
               {books.length > 0 && (
                  <div className="flex justify-between items-center mb-2">
                     <p className="font-semibold text-lg">New Collection</p>
                     {books.length > 10 && (
                        <Button
                           variant="link"
                           className="text-xs"
                           onClick={() => navigate("/catalog-book")}
                        >
                           View More
                        </Button>
                     )}
                  </div>
               )}

               {isSearching ? (
                  <div className="border rounded-lg w-full h-60 flex justify-center items-center">
                     <p className="text-center text-sm">Loading...</p>
                  </div>
               ) : books.length > 0 ? (

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-7">
                     {books.slice(0, 10).map((book, i) => (
                        <Card key={i}>
                           <div className="relative">
                              <img
                                 src={
                                    !book.coverBook.includes("http")
                                       ? "https://cf.ltkcdn.net/cats/grooming/images/orig/325183-1600x1066-ginger-cat.jpg"
                                       : book.coverBook
                                 }
                                 alt="book"
                                 className="h-56 w-full object-cover rounded-t-lg"
                              />
                              <div
                                 className={`flex justify-center items-center w-fit h-fit px-2 py-0.5 rounded-full absolute top-2 left-3 ${getStatusStyles(book.status).bg
                                    }`}
                              >
                                 <p className="font-medium text-[10px] text-white">
                                    {book.status}
                                 </p>
                              </div>
                              <div className="flex justify-center items-center w-fit h-fit px-2 py-0.5 rounded-full absolute bottom-2 left-3 bg-black">
                                 <p className="font-medium text-[10px] text-white">
                                    {book.codeBook}
                                 </p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-y-1 p-3">
                              <Link
                                 to={`/catalog-book/detail/${book.id}`}
                                 className="hover:underline"
                              >
                                 <p className="font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                                    {book.title}
                                 </p>
                              </Link>
                              <p className="text-xs">{book.author}</p>
                              <p className="text-xs">{book.year}</p>
                           </div>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <div className="border rounded-lg w-full h-60 flex justify-center items-center">
                     <p className="text-center text-sm">Data Not Found</p>
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
};

export default Home;
