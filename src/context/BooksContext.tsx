import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Book {
   id: number;
   codeBook: string;
   author: string;
   title: string;
   description: string;
   year: string;
   price?: number;
   coverBook: string;
}

interface BooksContextProps {
   books: Book[];
   filteredBooks: Book[];
   searchBooks: (q: string, filterBy: "all" | "author" | "title") => void;
   addBooks: (newBook: Book) => Promise<void>;
   handleDeleteBook: (id: any) => Promise<void>;
   editBook: (id: number, updatedBook: Book) => Promise<void>;
   isLoadingBooks: boolean;
}

// const BooksContext = createContext<BooksContextProps>({
//    books: [],
//    filteredBooks: [],
//    searchBooks: () => { },
//    addBooks: async () => { }
// })

const BooksContext = createContext<BooksContextProps | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const { toast } = useToast();
   const [books, setBooks] = useState<Book[]>([]);
   const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
   const [isLoadingBooks, setIsLoadingBooks] = useState(true);

   useEffect(() => {
      setIsLoadingBooks(true);
      const timeoutId = setTimeout(() => {
         fetch("http://localhost:3000/books")
            .then((response) => response.json())
            .then((data) => {
               setBooks(data);
               setFilteredBooks(data);
            })
            .catch((error) => console.error("error fetching books", error))
            .finally(() => {
               setIsLoadingBooks(false);
            });
      }, 1000);
      return () => clearTimeout(timeoutId);
   }, []);

   const searchBooks = (q: string, filterBy: "all" | "author" | "title") => {
      const query = q.trim().toLowerCase();
      const matchQuery = (str: string) => str.toLowerCase().includes(query);

      if (!query) {
         setFilteredBooks(books);
         return;
      }

      const filteredBooks = books.filter((book) => {
         if (filterBy === "author") return matchQuery(book.author);
         if (filterBy === "title") return matchQuery(book.title);
         return (
            matchQuery(book.author) ||
            matchQuery(book.title) ||
            book.year.includes(query) ||
            book.codeBook.includes(query)
         );
      });

      setFilteredBooks(filteredBooks);
   };

   // CREATE
   const addBooks = async (newBook: Book) => {
      try {
         const response = await fetch("http://localhost:3000/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook),
         });

         const addedBook = await response.json();
         setBooks((prev) => [...prev, addedBook]);
         setFilteredBooks((prev) => [...prev, addedBook]);
      } catch (error) {
         console.error(error);
      }
   };

   // DELETE
   const handleDeleteBook = async (id: number) => {
      try {
         const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: "DELETE",
         });

         toast({ description: "Your book has been successfully deleted." });

         if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
         }
         // Update state
         setBooks((prev) => prev.filter((book) => book.id !== id));
         setFilteredBooks((prev) => prev.filter((book) => book.id !== id));
      } catch (error) {
         console.error("Error deleting book:", error);
      }
   };

   // EDIT
   const editBook = async (id: number, updatedBook: Book) => {
      try {
         const response = await fetch(`http://localhost:3000/books/${id}`, {
            method: "PUT", // atau 'PATCH'
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBook),
         });

         if (!response.ok) {
            throw new Error("Error updating book");
         }

         const newBook = await response.json();

         // Update state
         setBooks((prev) => prev.map((book) => (book.id === id ? newBook : book)));
         setFilteredBooks((prev) =>
            prev.map((book) => (book.id === id ? newBook : book)),
         );
         toast({ title: "Book updated successfully!" });
      } catch (error) {
         console.error("Error updating book:", error);
      }
   };

   return (
      <BooksContext.Provider
         value={{
            books,
            filteredBooks,
            searchBooks,
            addBooks,
            handleDeleteBook,
            editBook,
            isLoadingBooks,
         }}
      >
         {children}
      </BooksContext.Provider>
   );
};

export const useBooks = () => useContext(BooksContext)!;
