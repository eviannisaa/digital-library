import { fetchData } from "@/utils/fetchData";
import { create } from "zustand";

interface Book {
  id: number;
  author: string;
  title: string;
  description: string;
  year: number;
  price?: number;
  coverBook: string;
  isbn: string;
  status: string;
  genre: string;
  codeBook: string;
}

interface BooksState {
  books: Book[];
  allBooks: Book[];
  isLoadingBooks: boolean;
  bookDetails: Book | null;

  fetchBooks: () => Promise<void>;
  fetchBookById: (id: number) => Promise<void>;
  createBook: (newBook: Book) => Promise<void>;
  editBook: (id: number, updatedBook: Book) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBy: "all" | "author" | "title" | "status" | "year" | "codeBook";
  setFilterBy: (
    filter: "all" | "author" | "title" | "status" | "year" | "codeBook",
  ) => void;

  isSearching: boolean;
  searchBooks: (q: string, filterBy: string) => void;
  handleSearch: () => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],
  allBooks: [],
  isLoadingBooks: true,
  bookDetails: null,

  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  filterBy: "all",
  setFilterBy: (
    filter: "all" | "author" | "title" | "status" | "year" | "codeBook",
  ) => set({ filterBy: filter }),
  isSearching: false,

  fetchBooks: async () => {
    set({ isLoadingBooks: true });
    try {
      const data = await fetchData("http://localhost:3000/books");
      set({ books: data, allBooks: data });
      const lastID = data[data.length - 1]?.id
      localStorage.setItem("lastIdBook", JSON.stringify(lastID))
    } catch (error) {
      console.error("error fetching books", error);
    } finally {
      set({ isLoadingBooks: false });
    }
  },

  fetchBookById: async (id: number) => {
    set({ isLoadingBooks: true });
    try {
      const data = await fetchData(`http://localhost:3000/books/${id}`);
      set({ bookDetails: data });
    } catch (error) {
      console.error("Error fetching detail book:", error);
    } finally {
      set({ isLoadingBooks: false });
    }
  },

  createBook: async (newBook: Book) => {
    try {
      const data = await fetchData("http://localhost:3000/books", {
        method: "POST",
        body: newBook,
      });
      set((state) => ({
        books: [...state.books, data],
      }));
    } catch (error) {
      console.error("Error adding book", error);
    }
  },

  editBook: async (id: number, updatedBook: Book) => {
    try {
      const data = await fetchData(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        body: updatedBook,
      });
      set((state) => ({
        books: state.books.map((book) => (book.id === id ? data : book)),
      }));
    } catch (error) {
      console.error("Error updating book:", error);
    }
  },

  deleteBook: async (id: number) => {
    try {
      await fetchData(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  },

  searchBooks: (q, filterBy) => {
    const query = q.trim().toLowerCase();
    const matchQuery = (str: string) =>
      str?.toString().toLowerCase().includes(query);
    const { allBooks } = get();

    const filteredBooks = allBooks.filter((book) => {
      if (filterBy === "author") return matchQuery(book.author);
      if (filterBy === "title") return matchQuery(book.title);
      if (filterBy === "status") return matchQuery(book.status);
      if (filterBy === "year") return matchQuery(String(book.year));
      if (filterBy === "codeBook") return matchQuery(book.codeBook);
      return (
        matchQuery(book.author) ||
        matchQuery(book.title) ||
        matchQuery(book.status) ||
        matchQuery(String(book.year)) ||
        matchQuery(book.codeBook)
      );
    });

    set({ books: filteredBooks });
  },

  handleSearch: () => {
    const { searchQuery, filterBy } = get();
    set({ isSearching: true });
    get().searchBooks(searchQuery, filterBy);
    setTimeout(() => {
      set({ isSearching: false });
    }, 500);
  },
}));
