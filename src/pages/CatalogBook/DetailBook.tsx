import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBooksStore } from "@/store/useBookStore";
import { useCatalogHooks } from "./useCatalogHooks";
import Layout from "@/components/ui/layout";

const DetailBook = () => {
   const { fetchBookById, bookDetails } = useBooksStore();
   const { menus, getStatusStyles, formatPrice, id, navigate } =
      useCatalogHooks();

   useEffect(() => {
      const fetchBookData = async () => {
         try {
            await fetchBookById(Number(id));
         } catch (error) { }
      };

      fetchBookData();
   }, [id, fetchBookById]);

   return (
      <Layout submenus={menus}>
         <Card className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 items-start w-3/5 m-auto p-10 shadow-slate-900">
            <div className="col-span-1 m-auto h-full flex flex-col gap-6">
               <img
                  src={
                     !bookDetails?.coverBook.includes("http")
                        ? "https://cf.ltkcdn.net/cats/grooming/images/orig/325183-1600x1066-ginger-cat.jpg"
                        : bookDetails?.coverBook
                  }
                  alt="detail book"
                  className="rounded-lg h-40 md:h-64 w-full shadow-slate-800 shadow-md"
               />
               <Button
                  onClick={() => navigate("/lending-book/form")}
                  disabled={bookDetails?.status !== "Available"}
               >
                  Borrow
               </Button>
            </div>

            <div className="col-span-2 grid grid-cols-1 gap-4">
               <div className="flex flex-col md:flex-row gap-x-6 gap-y-3 items-center mt-6 lg:mt-0">
                  <Badge
                     variant="secondary"
                     className={`w-full md:w-fit text-xs flex gap-2 ${getStatusStyles(bookDetails?.status!).text
                        }`}
                  >
                     <div
                        className={`w-2 h-2 rounded-full ${getStatusStyles(bookDetails?.status!).bg
                           }`}
                     ></div>
                     <p>{bookDetails?.status}</p>
                  </Badge>

                  <Badge
                     variant="secondary"
                     className="font-semibold w-full md:w-fit flex gap-2"
                  >
                     <div className={`w-2 h-2 bg-black rounded-full`}></div>
                     <p> Code Book : {bookDetails?.codeBook}</p>
                  </Badge>
               </div>

               <p className="text-xl md:text-2xl font-semibold">
                  {bookDetails?.title}
               </p>

               <p className="text-sm font-normal text-gray-600">
                  {bookDetails?.description}

                  {/* additional text for the summary */}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                  pellentesque nunc euismod congue efficitur. Quisque venenatis
                  fringilla interdum. Class aptent taciti sociosqu ad litora torquent
                  per conubia nostra, per inceptos himenaeos. Curabitur sed porta
                  nisl. Sed justo risus, eleifend a lacinia vitae, iaculis ac tortor.
                  Aenean at lectus leo. Donec varius aliquam mi sed consequat. Sed nec
                  ornare justo.
               </p>

               <hr className="my-2" />

               <div>
                  <p className="font-semibold text-sm ">Information</p>
                  <div className="flex flex-col md:flex-row gap-x-8 gap-y-2 lg:items-center mt-2 text-xs">
                     <div className="flex flex-col gap-1">
                        <p className="font-medium">Author</p>
                        <p className="text-gray-600">{bookDetails?.author}</p>
                     </div>
                     <div className="flex flex-col gap-1">
                        <p className="font-medium">Year</p>
                        <p className="text-gray-600">{bookDetails?.year}</p>
                     </div>
                     <div className="flex flex-col gap-1">
                        <p className="font-medium">ISBN</p>
                        <p className="text-gray-600">{bookDetails?.isbn}</p>
                     </div>
                     <div className="flex flex-col gap-1">
                        <p className="font-medium">Price</p>
                        <p className="text-gray-600">
                           {formatPrice(bookDetails?.price!)}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </Card>
      </Layout>
   );
};

export default DetailBook;
