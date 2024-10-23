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
import { useManageHooks } from "./useManageHooks";
import Layout from "@/components/ui/layout";

const CreateBook = () => {
   const { createMenus, form, onSubmitCreatedBook, fileInputRef } = useManageHooks();

   return (
      <Layout submenus={createMenus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmitCreatedBook)}
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
                                 pattern="\d*"
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
                  <div className="hidden">
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Input  {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  <span></span>
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

export default CreateBook;
