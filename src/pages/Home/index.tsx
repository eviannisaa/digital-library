import { useState } from "react";
import Layout from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card } from "@/components/ui/card";
import { useBooks } from "@/context/BooksContext";
import SearchIcon from "../../assets/icon-search.svg";
import { useNavigate } from "react-router-dom";
import { HomeSkeleton } from "@/components/ui/skeleton";

const Home = () => {
   const navigate = useNavigate();
   const { filteredBooks, searchBooks, isLoadingBooks } = useBooks();
   const [searchQuery, setSearchQuery] = useState("");
   const [filterBy, setFilterBy] = useState<"all" | "author" | "title">("all");
   const [isSearching, setIsSearching] = useState(false);

   const handleSearch = () => {
      setIsSearching(true);
      searchBooks(searchQuery, filterBy);
      setTimeout(() => {
         setIsSearching(false);
      }, 500);
   };

   if (isLoadingBooks) {
      return <HomeSkeleton />;
   }

   return (
      <Layout cta={true}>
         <div className="flex flex-col gap-y-5">
            <div className="flex flex-col md:flex-row gap-3 items-center">
               <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
               />
               <ToggleGroup
                  type="single"
                  variant="outline"
                  value={filterBy}
                  onValueChange={(value) =>
                     setFilterBy(value as "all" | "author" | "title")
                  }
               >
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                  <ToggleGroupItem value="author">Author</ToggleGroupItem>
                  <ToggleGroupItem value="title">Title</ToggleGroupItem>
               </ToggleGroup>
               <Button onClick={handleSearch}>
                  <img src={SearchIcon} alt="search icon" className="w-6 h-6" />
               </Button>
            </div>

            <div>
               {filteredBooks.length > 0 && (
                  <div className="flex justify-between items-center mb-2">
                     <p className="font-semibold text-lg">Fresh Read!</p>
                     <Button
                        variant="link"
                        className="text-xs"
                        onClick={() => navigate("/catalog-book")}
                     >
                        View more...
                     </Button>
                  </div>
               )}

               {isSearching ? (
                  <div className="border rounded-lg w-full h-60 flex justify-center items-center">
                     <p className="text-center text-sm">Loading...</p>
                  </div>
               ) : filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-x-5 gap-y-7">
                     {filteredBooks.slice(0, 10).map((book, i) => (
                        <Card key={i}>
                           <div className="relative">
                              <img
                                 src={book.coverBook}
                                 alt="book"
                                 className="h-48 w-full object-cover rounded-t-lg"
                              />
                              <div className="flex justify-center items-center w-6 h-6 rounded-md absolute top-2 right-3 bg-black">
                                 <p className="font-medium text-xs text-white">
                                    {book.codeBook}
                                 </p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-y-1 p-3">
                              <p className="font-bold text-sm">{book.title}</p>
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
