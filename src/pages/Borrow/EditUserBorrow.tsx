import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useUserBorrow } from "@/context/UsersContext";
import { defaultValue, validationSchema } from "./validationSchema";
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
import { useBooks } from "@/context/BooksContext";
import { FormSkeleton } from "@/components/ui/skeleton";

const menus = [
   {
      label: "Borrow Book",
      active: false,
      to: "/borrow-book",
   },
   {
      label: "Edit User",
      active: true,
   },
];

const EditUserBorrow = () => {
   const { id } = useParams<{ id: string }>();
   const { editUserBorrow, isLoadingUsers } = useUserBorrow();
   const { filteredBooks, isLoadingBooks } = useBooks();
   const { toast } = useToast();

   const form = useForm<z.infer<typeof validationSchema>>({
      resolver: zodResolver(validationSchema),
      defaultValues: defaultValue,
      mode: "onSubmit",
   });

   const fetchUserData = async () => {
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`);
         const json = await response.json();
         const codeBook = Array.isArray(json.codeBook)
            ? json.codeBook
            : [json.codeBook];
         form.reset({
            codeBook: codeBook ?? [],
            name: json.name ?? "",
            gender: json.gender ?? "",
            loanDate: json.loanDate
               ? new Date(json.loanDate).toISOString().split("T")[0]
               : "",
            returnDate: json.returnDate ?? "",
            totalItem: json.totalItem ?? "",
            status: json.status ?? "",
         });
      } catch (error) {
         console.error("Error fetching book data:", error);
      }
   };

   useEffect(() => {
      fetchUserData();
   }, [id, form]);

   const onSubmit = async (data: any) => {
      fetchUserData();

      try {
         await editUserBorrow(Number(id), data);
         toast({
            title: "Success!",
            description: "The book has been successfully updated.",
         });
      } catch (error) {
         console.error("Error updating book:", error);
      }

      window.location.href = "/borrow-book";
   };

   if (isLoadingUsers && isLoadingBooks) {
      return <FormSkeleton />;
   }

   return (
      <Layout submenus={menus}>
         <Card className="p-8 w-3/4 m-auto">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-10 mb-4 items-start">
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
                                    <RadioGroupItem value="male" id="r1" />
                                    <Label htmlFor="male">Male</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="r2" />
                                    <Label htmlFor="female">Female</Label>
                                 </div>
                              </RadioGroup>
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="loanDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Loan Date</FormLabel>
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
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="totalItem"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Total Book</FormLabel>
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
                                 className="grid grid-cols-2"
                              >
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="returned" id="r1" />
                                    <Label htmlFor="returned">Returned</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="notreturned" id="r2" />
                                    <Label htmlFor="notreturned">Not Returned</Label>
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
                           <div className="grid grid-cols-2 gap-3 items-start">
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
                                                      form.setValue("totalItem", totalCount);
                                                   }}
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
                     <Button type="submit" size="lg" className="mt-8 w-40">
                        Save
                     </Button>
                  </div>
               </form>
            </Form>
         </Card>
      </Layout>
   );
};

export default EditUserBorrow;
