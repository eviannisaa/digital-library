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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useBooksStore } from "@/store/useBookStore";
import { useManageHooks } from "./useManageHooks";
import Layout from "@/components/ui/layout";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const EditBook = () => {
   const { isLoadingBooks, fetchBookById } = useBooksStore();
   const { editMenus, form, onSubmitEditedBook, fileInputRef, id } =
      useManageHooks();

   useEffect(() => {
      const fetchBookData = async () => {
         try {
            await fetchBookById(Number(id));
         } catch (error) { }
      };
      fetchBookData();
   }, [id, fetchBookById]);

   if (isLoadingBooks) {
      return <FormSkeleton />;
   }

   return (
      <Layout submenus={editMenus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmitEditedBook)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 items-start"
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
                                 onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    const value = input.value.replace(/[^0-9]/g, "");
                                    field.onChange(value ? parseInt(value) : undefined);
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
                                 onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    const value = input.value.replace(/[^0-9]/g, "");
                                    field.onChange(value ? parseInt(value) : undefined);
                                 }}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="isbn"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>ISBN</FormLabel>
                           <FormControl>
                              <Input placeholder="Input ISBN" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="status"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Status</FormLabel>
                           <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex flex-col lg:flex-row justify-between"
                           >
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="Available" id="r1" />
                                 <Label htmlFor="Available">Available</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="Borrowed" id="r2" />
                                 <Label htmlFor="Borrowed">Borrowed</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="Reserved" id="r2" />
                                 <Label htmlFor="Reserved">Reserved</Label>
                              </div>
                           </RadioGroup>
                        </FormItem>
                     )}
                  />
                  <div className="flex justify-end">
                     <Button type="submit" size="lg" className="mt-8 md:w-60 w-full">
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
