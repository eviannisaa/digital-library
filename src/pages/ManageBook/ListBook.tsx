import { useEffect, useState } from "react";
import {
   ColumnDef,
   ColumnFiltersState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   useReactTable,
   VisibilityState,
} from "@tanstack/react-table";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import Layout from "@/components/ui/layout";
import { useBooksStore } from "@/store/useBookStore";
import { ListSkeleton } from "@/components/ui/skeleton";
import { ChevronDownIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useManageHooks } from "./useManageHooks";
import { formatAmount } from "@/utils/formatAmount";

interface Book {
   id: number;
   codeBook: string;
   author: string;
   title: string;
   description: string;
   year: string;
   price: number;
   coverBook: string;
}

export const columns: ColumnDef<Book | any>[] = [
   {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
         <div className="capitalize">{row.getValue("author")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
         <div className="capitalize">{row.getValue("title")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
         <div className="capitalize">{row.getValue("description")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "year",
      header: () => <div className="text-center">Year</div>,
      cell: ({ row }) => (
         <div className="capitalize text-center">{row.getValue("year")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "coverBook",
      header: "Cover Book",
      cell: ({ row }) => {
         const coverBook: string = row.getValue("coverBook");
         return (
            <img
               src={
                  !coverBook.includes("http")
                     ? "https://cf.ltkcdn.net/cats/grooming/images/orig/325183-1600x1066-ginger-cat.jpg"
                     : row.getValue("coverBook")
               }
               alt="cover book"
               className="h-16 w-18 rounded-sm m-auto"
            />
         );
      },
      enableGlobalFilter: false,
   },
   {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
         return <div className="capitalize">{formatAmount(row.getValue("price"))}</div>;
      },
      enableGlobalFilter: true,
   },
   {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
         const { getStatusColor } = useManageHooks();
         return (
            <div className="flex justify-center">
               <div
                  className={`flex justify-center w-fit h-fit px-2 py-0.5 rounded-full font-medium text-[10px] text-white ${getStatusColor(
                     row.getValue("status"),
                  )} `}
               >
                  {row.getValue("status")}
               </div>
            </div>
         );
      },
      enableGlobalFilter: true,
   },
   {
      accessorKey: "codeBook",
      header: () => <div className="text-center">Code Book</div>,
      cell: ({ row }) => (
         <div className="capitalize text-center">{row.getValue("codeBook")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
         const { deleteBook } = useBooksStore();
         return (
            <div className="flex flex-row justify-center gap-6">
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" size="icon" className="w-8 h-8">
                        <TrashIcon />
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete
                           your data and remove your data from our servers.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={() => deleteBook(row.original.id)}
                        >
                           Continue
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
               <Button
                  size="icon"
                  className="w-8 h-8"
                  onClick={() =>
                     (window.location.href = `/catalog-book/edit/${row.original.id}`)
                  }
               >
                  <Pencil1Icon />
               </Button>
            </div>
         );
      },
   },
];

const ListBook = () => {
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = useState({});
   const { books, isLoadingBooks, fetchBooks } = useBooksStore();
   const { listMenus } = useManageHooks();

   const table = useReactTable({
      data: books,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
   });

   useEffect(() => {
      fetchBooks();
   }, [fetchBooks]);

   if (isLoadingBooks) {
      return <ListSkeleton />;
   }

   return (
      <Layout create submenus={listMenus}>
         <div className="w-full">
            <div className="flex gap-2 items-center py-4">
               <Input
                  placeholder="Search..."
                  className="max-w-sm"
                  value={table.getState().globalFilter || ""}
                  onChange={(event) => {
                     const value = event.target.value;
                     table.setGlobalFilter(value);
                  }}
               />

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto">
                        Filter By <ChevronDownIcon className="ml-2 h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {table
                        .getAllColumns()
                        .filter(
                           (column) => column.getCanHide() && column.id !== "actions",
                        )
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                 }
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           );
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <div className="rounded-md border">
               <Table>
                  <TableHeader className="">
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="">
                           {headerGroup.headers.map((header) => {
                              return (
                                 <TableHead key={header.id} className="">
                                    {header.isPlaceholder
                                       ? null
                                       : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext(),
                                       )}
                                 </TableHead>
                              );
                           })}
                        </TableRow>
                     ))}
                  </TableHeader>
                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                           return (
                              <TableRow key={row.id}>
                                 {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                       {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                       )}
                                    </TableCell>
                                 ))}
                              </TableRow>
                           );
                        })
                     ) : (
                        <TableRow>
                           <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                           >
                              No results.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
               <div className="flex-1 text-sm text-muted-foreground">
                  Showing {table.getRowModel().rows.length} of&nbsp;
                  {table.getFilteredRowModel().rows.length}
               </div>
               <div className="space-x-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                  >
                     Previous
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                  >
                     Next
                  </Button>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default ListBook;
