import { useState } from "react";
import {
   ColumnDef,
   ColumnFiltersState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   Row,
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
import { useUserBorrow } from "@/context/UsersContext";
import { ChevronDownIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserBorrow {
   id: number;
   codeBook: string[];
   name: string;
   gender: string;
   loanDate: string;
   returnDate: string;
   totalItem: number;
   status: string;
}

export const columns: ColumnDef<UserBorrow | any>[] = [
   {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
      enableGlobalFilter: true,
   },
   {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
         <div className="capitalize">{row.getValue("gender")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "loanDate",
      header: "Loan Date",
      cell: ({ row }) => (
         <div>
            {new Date(row.getValue("loanDate") as string).toLocaleDateString(
               "en-US",
               { year: "numeric", month: "long", day: "numeric" },
            )}
         </div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "totalItem",
      header: () => <div className="text-center">Total Book</div>,
      cell: ({ row }) => (
         <div className="text-center">{row.getValue("totalItem")}</div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "codeBook",
      header: "Code Book",
      cell: ({ row }: { row: Row<UserBorrow> }) => {
         const codeBookValue = row.getValue("codeBook") as string[];
         const displayedCodes = codeBookValue.slice(0, 3);
         return (
            <div className="flex flex-wrap items-center">
               {displayedCodes.join(", ")}
               {codeBookValue.length > 3 && (
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger>
                           <div className="text-gray-500 ml-1 text-xs font-medium">
                              + {codeBookValue.length - 3} more
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{codeBookValue.slice(3).join(", ")}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         );
      },
      enableGlobalFilter: false,
   },
   {
      accessorKey: "returnDate",
      header: "Return Date",
      cell: ({ row }) => (
         <div>
            {new Date(row.getValue("returnDate") as string).toLocaleDateString(
               "en-US",
               { year: "numeric", month: "long", day: "numeric" },
            )}
         </div>
      ),
      enableGlobalFilter: true,
   },
   {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
         const status = row.getValue<string>("status")?.toLowerCase();

         let variant: "default" | "destructive" | "secondary";
         let text: string;

         if (status === "notreturned") {
            variant = "default";
            text = "Not Returned";
         } else if (status === "returned") {
            variant = "secondary";
            text = "Returned";
         } else {
            variant = "destructive";
            text = "Overdue";
         }

         return (
            <div className="flex justify-center">
               <Badge variant={variant}>{text}</Badge>
            </div>
         );
      },
      enableGlobalFilter: true,
   },
   {
      accessorKey: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
         const { handleDeleteUser } = useUserBorrow();

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
                           onClick={() => handleDeleteUser(row.original.id)}
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
                     (window.location.href = `/borrow-book/edit-user/${row.original.id}`)
                  }
               >
                  <Pencil1Icon />
               </Button>
            </div>
         );
      },
   },
];

export const ListBorrow = () => {
   const [sorting, setSorting] = useState<SortingState>([
      { id: "loanDate", desc: true },
   ]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
   const [rowSelection, setRowSelection] = useState({});
   const { filteredUsers } = useUserBorrow();

   const table = useReactTable({
      data: filteredUsers,
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

   return (
      <div className="w-full">
         <div className="flex items-center py-4">
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
                     .filter((column) => column.getCanHide())
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
   );
};
