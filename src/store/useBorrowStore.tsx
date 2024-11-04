import { fetchData } from "@/utils/fetchData";
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
   isLoadingUsers: boolean;
   userDetails: User | null;

   fetchUsers: () => Promise<void>;
   fetchUserById: (id: number) => Promise<void>;
   addUserBorrow: (newBorrow: User) => Promise<void>;
   editUserBorrow: (id: number, updatedUser: User) => Promise<void>;
   deleteUserBorrow: (id: number) => Promise<void>;
}

export const useBorrowStore = create<UsersState>((set, get) => ({
   users: [],
   isLoadingUsers: true,
   userDetails: null,

   fetchUsers: async () => {
      set({ isLoadingUsers: true });
      try {
         const data = await fetchData("http://localhost:3000/users");
         set({ users: data });
         const lastID = data[data.length - 1]?.id
         localStorage.setItem("lastIdUserBorrow", JSON.stringify(lastID))
      } catch (error) {
         console.error("Error fetching users borrow", error);
      } finally {
         set({ isLoadingUsers: false });
      }
   },

   fetchUserById: async (id: number) => {
      set({ isLoadingUsers: true });
      try {
         const data = await fetchData(`http://localhost:3000/users/${id}`);
         set({ userDetails: data });
      } catch (error) {
         console.error("Error fetching detail user borrow:", error);
      } finally {
         set({ isLoadingUsers: false });
      }
   },

   addUserBorrow: async (newBorrow: User) => {
      try {
         const data = await fetchData("http://localhost:3000/users", {
            method: "POST",
            body: newBorrow,
         });

         set((state) => ({
            users: [...state.users, data],
         }));
      } catch (error) {
         console.error("Error adding user borrow", error);
      }
   },

   editUserBorrow: async (id: number, updatedUser: User) => {
      try {
         const data = await fetchData(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            body: updatedUser,
         });

         set((state) => ({
            users: state.users.map((user) => (user.id === id ? data : user)),
         }));
      } catch (error) {
         console.error("Error updating user borrow", error);
      }
   },

   deleteUserBorrow: async (id: number) => {
      try {
         await fetchData(`http://localhost:3000/users/${id}`, {
            method: "DELETE",
         });
         set((state) => ({
            users: state.users.filter((user) => user.id !== id),
         }));
      } catch (error) {
         console.error("Error deleting user borrow", error);
      }
   }
}));
