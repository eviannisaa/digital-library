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
import { useBooksStore } from "@/store/useBookStore";
import { useLandingHooks } from "./useLendingHooks";

const LendingForm = () => {
   const { filteredBooks, fetchBooks } = useBooksStore();
   const { formMenus, form, onAddedLending } = useLandingHooks();

   useEffect(() => {
      fetchBooks();
   }, [fetchBooks]);

   return (
      <Layout submenus={formMenus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onAddedLending)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 mb-4 items-start">
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
                                    <Label htmlFor="male">Male</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Female" id="r2" />
                                    <Label htmlFor="female">Female</Label>
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
                                    placeholder="Input Return Book"
                                    {...field}
                                    type="date"
                                    min={new Date().toISOString().slice(0, 10)}
                                    onChange={(e) => {
                                       const selectedDate = e.target.value;
                                       field.onChange(selectedDate);
                                       const currentDate = new Date().toISOString();
                                       if (currentDate <= selectedDate) {
                                          form.setValue("status", "not yet returned");
                                       }
                                    }}
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
                              <FormMessage />
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
                                 <Input disabled {...field} />
                              </FormControl>
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
                              <FormLabel className="text-base">Choose Books</FormLabel>
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
                                                      item.status === "Borrowed" ||
                                                      item.status === "Reserved"
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
                  <div className="hidden">
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                  </div>

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

export default LendingForm;
