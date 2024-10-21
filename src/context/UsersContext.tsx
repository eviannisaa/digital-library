import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
   id: number;
   codeBook: string[];
   name: string;
   gender: string;
   loanDate: string;
   returnDate: string;
   totalItem?: number;
   status: string;
}

interface UsersContextProps {
   users: User[];
   filteredUsers: User[];
   addUserBorrow: (newBorrow: User) => Promise<void>;
   handleDeleteUser: (id: any) => Promise<void>;
   editUserBorrow: (id: number, updatedUser: User) => Promise<void>;
   isLoadingUsers: boolean;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const { toast } = useToast();
   const [users, setUsers] = useState<User[]>([]);
   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
   const [isLoadingUsers, setIsLoadingUsers] = useState(true);

   useEffect(() => {
      setIsLoadingUsers(true);
      const timeoutId = setTimeout(() => {
         fetch("http://localhost:3000/users")
            .then((response) => response.json())
            .then((data) => {
               setUsers(data);
               setFilteredUsers(data);
            })
            .catch((error) => console.error("error fetching books", error))
            .finally(() => {
               setIsLoadingUsers(false);
            });
      }, 1000);
      return () => clearTimeout(timeoutId);
   }, []);

   // CREATE
   const addUserBorrow = async (newBorrow: User) => {
      try {
         const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBorrow),
         });

         const addedUser = await response.json();
         setUsers((prev) => [...prev, addedUser]);
         setFilteredUsers((prev) => [...prev, addedUser]);
      } catch (error) {
         console.error(error);
      }
   };

   // DELETE
   const handleDeleteUser = async (id: number) => {
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
         });

         toast({ description: "The user has been successfully deleted." });

         if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
         }
         // Update state
         setUsers((prev) => prev.filter((user) => user.id !== id));
         setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (error) {
         console.error("Error deleting book:", error);
      }
   };

   // EDIT
   const editUserBorrow = async (id: number, updatedUser: User) => {
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
         });

         if (!response.ok) {
            throw new Error("Error updating book");
         }

         const newUser = await response.json();

         // Update state
         setUsers((prev) => prev.map((user) => (user.id === id ? newUser : user)));
         setFilteredUsers((prev) =>
            prev.map((user) => (user.id === id ? newUser : user)),
         );
         toast({ title: "The User updated successfully!" });
      } catch (error) {
         console.error("Error updating book:", error);
      }
   };

   return (
      <UsersContext.Provider
         value={{
            users,
            filteredUsers,
            addUserBorrow,
            handleDeleteUser,
            editUserBorrow,
            isLoadingUsers,
         }}
      >
         {children}
      </UsersContext.Provider>
   );
};

export const useUserBorrow = () => useContext(UsersContext)!;
