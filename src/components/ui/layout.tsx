import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil2Icon, PlusIcon, ReaderIcon } from "@radix-ui/react-icons";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import { Toaster } from "./toaster";

interface LayoutProps {
   cta?: boolean;
   manage?: boolean;
   create?: boolean;
   borrow?: boolean;
   submenu?: string;
   children: React.ReactNode;
   submenus?: { label: string; active: boolean; to?: string }[];
}

const Layout: React.FC<LayoutProps> = ({
   cta,
   create,
   manage,
   borrow,
   submenus,
   children,
}) => {
   const navigate = useNavigate();

   return (
      <div className="w-full">
         <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center fixed w-full px-8 pt-10 pb-6 z-10 bg-white">
            <Breadcrumb>
               <BreadcrumbList>
                  <BreadcrumbItem>
                     <div onClick={() => navigate("/")} className="cursor-pointer">
                        <p className="font-bold text-lg lg:text-2xl text-black">
                           Digital Library
                        </p>
                     </div>
                  </BreadcrumbItem>
                  {submenus?.map((menu, i) => (
                     <React.Fragment key={i}>
                        <BreadcrumbSeparator
                           key={i}
                           className={menu.active ? "text-black" : ""}
                        />
                        <BreadcrumbItem>
                           <div
                              onClick={() => navigate(menu.to ?? "")}
                              className="cursor-pointer"
                           >
                              <BreadcrumbLink>
                                 <p className={menu.active ? "text-black" : ""}>
                                    {menu.label}
                                 </p>
                              </BreadcrumbLink>
                           </div>
                        </BreadcrumbItem>
                     </React.Fragment>
                  ))}
               </BreadcrumbList>
            </Breadcrumb>

            {cta && (
               <div className="flex flex-row gap-x-16 items-center">
                  <div className="flex flex-row gap-x-3">
                     <Button
                        className="font-xs md:w-fit w-full"
                        onClick={() => window.location.href = "catalog-book"}
                     >
                        Catalog Book
                     </Button>
                  </div>
               </div>
            )}
            {manage && (
               <div className="flex justify-end gap-x-16">
                  <div className="flex flex-col md:flex-row md:justify-end gap-3 w-full">
                     <Button
                        className="font-xs w-full md:w-fit"
                        onClick={() => window.location.href = "/catalog-book/lending-book"}
                     >
                        <ReaderIcon />
                        Lending
                     </Button>
                     <Button
                        variant="outline"
                        className="font-xs text-black md:w-fit"
                        onClick={() => window.location.href = "/catalog-book/manage"}
                     >
                        <Pencil2Icon />
                        Manage
                     </Button>
                  </div>
               </div>
            )}
            {borrow && (
               <div className="flex justify-end">
                  <Button
                     className="font-xs md:w-fit w-full"
                     onClick={() => window.location.href = "/lending-book/form"}
                  >
                     <PlusIcon /> Borrow
                  </Button>
               </div>
            )}
            {create && (
               <div className="w-full md:w-fit flex justify-end">
                  <Button
                     className="font-xs md:w-fit w-full"
                     onClick={() => window.location.href = "/catalog-book/create"}
                  >
                     <PlusIcon /> Add Book
                  </Button>
               </div>
            )}
         </div>
         <div className="px-8">
            <div
               className={`pb-4 md:pt-32 ${manage ? "pt-48" : borrow || create || cta ? "pt-40" : "pt-32"
                  }`}
            >
               {children}
            </div>
            <Toaster />
         </div>
      </div>
   );
};

export default Layout;
