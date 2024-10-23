import { create } from "zustand";

interface User {
   id: number;
   codeBook: string[];
   name: string;
   gender: string;
   returnDate: string;
   status: string;
   contact: string,
   lendingDate: string,
   totalBooks?: number,
   totalDays: number,
}

interface UsersState {
   users: User[];
   filteredUsers: User[];
   isLoadingUsers: boolean;
   addUserBorrow: (newBorrow: User) => Promise<void>;
   handleDeleteUser: (id: number) => Promise<void>;
   editUserBorrow: (id: number, updatedUser: User) => Promise<void>;
   fetchUsers: () => void;
   fetchUserById: (id: number) => Promise<void>;
   userDetails: User | null;
}

export const useBorrowStore = create<UsersState>((set, get) => ({
   users: [],
   filteredUsers: [],
   isLoadingUsers: true,
   userDetails: null,

   fetchUsers: async () => {
      set({ isLoadingUsers: true });
      try {
         const response = await fetch("http://localhost:3000/users");
         const data = await response.json();
         set({ users: data, filteredUsers: data });
      } catch (error) {
         console.error("error fetching users", error);
      } finally {
         set({ isLoadingUsers: false });
      }
   },

   fetchUserById: async (id: number) => {
      set({ isLoadingUsers: true });
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`);
         const json = await response.json();
         set({ userDetails: json });
      } catch (error) {
         console.error("Error fetching users data:", error);
      } finally {
         set({ isLoadingUsers: false });
      }
   },

   addUserBorrow: async (newBorrow: User) => {
      try {
         const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBorrow),
         });

         const addedBorrow = await response.json();
         set((state) => ({
            users: [...state.users, addedBorrow],
            filteredUsers: [...state.filteredUsers, addedBorrow],
         }));
      } catch (error) {
         console.error(error);
      }
   },

   handleDeleteUser: async (id: number) => {
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
         });

         if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
         }

         set((state) => ({
            users: state.users.filter((user) => user.id !== id),
            filteredUsers: state.filteredUsers.filter((user) => user.id !== id),
         }));
      } catch (error) {
         console.error("Error deleting users:", error);
      }
   },

   editUserBorrow: async (id: number, updatedUser: User) => {
      try {
         const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
         });

         if (!response.ok) {
            throw new Error("Error updating users");
         }

         const newBorrow = await response.json();

         set((state) => ({
            users: state.users.map((user) => (user.id === id ? newBorrow : user)),
            filteredUsers: state.filteredUsers.map((user) =>
               user.id === id ? newBorrow : user,
            ),
         }));
      } catch (error) {
         console.error("Error updating users:", error);
      }
   }
}));
