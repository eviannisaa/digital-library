import { useRef } from "react";
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

const menus = [
   {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
   },
   {
      label: "Created Book",
      active: true,
   },
];

const CreateBook = () => {
   const { addBooks } = useBooks();
   const { toast } = useToast();
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const form = useForm<z.infer<typeof validationSchema>>({
      resolver: zodResolver(validationSchema),
      defaultValues: defaultValue,
      mode: "onSubmit",
   });

   const onSubmit = async (values: z.infer<typeof validationSchema>) => {
      try {
         await addBooks({
            ...values,
            id: Math.random() * 1000,
            price: values.price ? parseFloat(values.price) : undefined,
         });

         form.reset();
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }

         toast({
            title: "Success!",
            description: "The book has been added successfully.",
         });
      } catch (error) {
         console.error("Failed to add book:", error);
      }
   };

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
                                    } else {
                                       field.onChange("");
                                    }
                                 }}
                              />
                           </FormControl>
                           <FormDescription>Format: JPG, PNG</FormDescription>
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

export default CreateBook;
