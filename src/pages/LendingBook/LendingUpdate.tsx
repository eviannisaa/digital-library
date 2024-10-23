import { useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSkeleton } from "@/components/ui/skeleton";
import { useBorrowStore } from "@/store/useBorrowStore";
import { useBooksStore } from "@/store/useBookStore";
import { useLandingHooks } from "./useLendingHooks";

const LendingUpdate = () => {
   const { isLoadingUsers, fetchUserById, fetchUsers } = useBorrowStore();
   const { filteredBooks, isLoadingBooks, fetchBooks } = useBooksStore();
   const { id, updateMenus, form, onUpdatedLending } = useLandingHooks();

   useEffect(() => {
      const fetchBookData = async () => {
         try {
            await fetchUserById(Number(id));
         } catch (error) { }
      };
      fetchBookData();
   }, [id, fetchUserById]);

   useEffect(() => {
      fetchBooks();
      fetchUsers();
   }, [fetchBooks, fetchUsers]);

   if (isLoadingUsers && isLoadingBooks) {
      return <FormSkeleton />;
   }

   return (
      <Layout submenus={updateMenus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onUpdatedLending)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 mb-5 items-start">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                 <Input placeholder="Input Name" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <RadioGroup
                                 value={field.value}
                                 onValueChange={field.onChange}
                                 className="grid grid-cols-2"
                              >
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Male" id="r1" />
                                    <Label htmlFor="Male">Male</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Female" id="r2" />
                                    <Label htmlFor="Female">Female</Label>
                                 </div>
                              </RadioGroup>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="lendingDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Lending Date</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Input Description"
                                    {...field}
                                    type="date"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="returnDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Return Date</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    type="date"
                                    min={new Date().toISOString().slice(0, 10)}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Contact</FormLabel>
                              <FormControl>
                                 <Input placeholder="Input Contact" {...field} />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="totalBooks"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Books</FormLabel>
                              <FormControl>
                                 <Input {...field} disabled />
                              </FormControl>
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
                                    <RadioGroupItem value="reserved" id="r2" />
                                    <Label htmlFor="reserved">Reserved</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="returned" id="r1" />
                                    <Label htmlFor="returned">Returned</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="not yet returned" id="r2" />
                                    <Label htmlFor="not yet returned">
                                       Not Yet Returned
                                    </Label>
                                 </div>
                              </RadioGroup>
                           </FormItem>
                        )}
                     />
                  </div>
                  <FormField
                     control={form.control}
                     name="codeBook"
                     render={() => (
                        <FormItem>
                           <div className="mb-4">
                              <FormLabel className="text-base">
                                 Update Your Books
                              </FormLabel>
                              <FormDescription>
                                 Select the books you want to borrow
                              </FormDescription>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                              {filteredBooks.map((item) => (
                                 <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="codeBook"
                                    render={({ field }) => {
                                       return (
                                          <FormItem
                                             key={item.id}
                                             className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                             <FormControl>
                                                <Checkbox
                                                   checked={field.value?.includes(item.codeBook)}
                                                   onCheckedChange={(checked) => {
                                                      const newValue = checked
                                                         ? [...field.value, item.codeBook]
                                                         : field.value.filter(
                                                            (value) => value !== item.codeBook,
                                                         );

                                                      field.onChange(newValue);

                                                      const totalCount = newValue.length;
                                                      form.setValue("totalBooks", totalCount);
                                                   }}
                                                   disabled={
                                                      item.id !== Number(id) &&
                                                      (item.status === "Borrowed" ||
                                                         item.status === "Reserved")
                                                   }
                                                />
                                             </FormControl>
                                             <FormLabel className="text-sm font-normal">
                                                {`[${item.codeBook}] ${item.title}`}
                                             </FormLabel>
                                          </FormItem>
                                       );
                                    }}
                                 />
                              ))}
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="flex justify-end">
                     <Button type="submit" size="lg" className="mt-8 md:w-40 w-full">
                        Save
                     </Button>
                  </div>
               </form>
            </Form>
         </Card>
      </Layout>
   );
};

export default LendingUpdate;
