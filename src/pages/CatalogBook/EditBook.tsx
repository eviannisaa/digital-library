import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import Layout from "@/components/ui/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/context/BooksContext";
import { useToast } from "@/hooks/use-toast";
import { defaultValue, validationSchema } from "./validationSchema";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { FormSkeleton } from "@/components/ui/skeleton";

const menus = [
   {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
   },
   {
      label: "Updated Book",
      active: true,
   },
];

const EditBook = () => {
   const { id } = useParams<{ id: string }>();
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const navigate = useNavigate();
   const { editBook, isLoadingBooks } = useBooks();
   const { toast } = useToast();

   const form = useForm<z.infer<typeof validationSchema>>({
      resolver: zodResolver(validationSchema),
      defaultValues: defaultValue,
      mode: "onSubmit",
   });

   useEffect(() => {
      const fetchBookData = async () => {
         try {
            const response = await fetch(`http://localhost:3000/books/${id}`);
            const json = await response.json();
            form.reset({
               author: json.author ?? "",
               title: json.title ?? "",
               description: json.description ?? "",
               year: json.year ?? "",
               price: json.price ? json.price.toString() : "",
               coverBook: json.coverBook ?? "",
               codeBook: json.codeBook ?? "",
            });
         } catch (error) {
            console.error("Error fetching book data:", error);
         }
      };
      fetchBookData();
   }, [id, form]);

   const onSubmit = async (data: any) => {
      try {
         await editBook(Number(id), data);
         toast({
            title: "Success!",
            description: "The book has been successfully updated.",
         });
      } catch (error) {
         console.error("Error updating book:", error);
      }

      navigate("/catalog-book");
   };

   if (isLoadingBooks) {
      return <FormSkeleton />;
   }

   return (
      <Layout submenus={menus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-2 gap-y-3 gap-x-10 items-start"
               >
                  <FormField
                     control={form.control}
                     name="author"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Author</FormLabel>
                           <FormControl>
                              <Input placeholder="Input Author" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Title</FormLabel>
                           <FormControl>
                              <Input placeholder="Input Title" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Input placeholder="Input Description" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="year"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Year</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Input Year"
                                 {...field}
                                 pattern="\d*"
                                 onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9]/g, "");
                                    field.onChange(input.value);
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="coverBook"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Cover Book</FormLabel>
                           <FormControl>
                              <Input
                                 type="file"
                                 accept="image/jpeg, image/png"
                                 ref={fileInputRef}
                                 onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                       field.onChange(file.name);
                                    }
                                 }}
                              />
                           </FormControl>
                           <FormDescription className="flex justify-between">
                              <p className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                                 Current file : {field.value}
                              </p>
                           </FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="codeBook"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Code Book</FormLabel>
                           <FormControl>
                              <Input placeholder="Input Code Book" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Input Price"
                                 {...field}
                                 pattern="\d*"
                                 min="0"
                                 onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9]/g, "");
                                    field.onChange(input.value);
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="flex justify-end">
                     <Button type="submit" size="lg" className="mt-8 w-60">
                        Save
                     </Button>
                  </div>
               </form>
            </Form>
         </Card>
      </Layout>
   );
};

export default EditBook;
