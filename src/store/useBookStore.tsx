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
  filteredBooks: Book[];
  isLoadingBooks: boolean;
  searchBooks: (
    q: string,
    filterBy: "all" | "author" | "title" | "status" | "year" | "codeBook",
  ) => void;
  createBook: (newBook: Book) => Promise<void>;
  handleDeleteBook: (id: number) => Promise<void>;
  editBook: (id: number, updatedBook: Book) => Promise<void>;
  fetchBooks: () => void;
  fetchBookById: (id: number) => Promise<void>;
  bookDetails: Book | null;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterBy: "all" | "author" | "title" | "status" | "year" | "codeBook";
  setFilterBy: (filter: "all" | "author" | "title" | "status" | "year" | "codeBook") => void;
  isSearching: boolean;
  handleSearch: () => void;
}

export const useBooksStore = create<BooksState>((set, get) => ({
  books: [],
  filteredBooks: [],
  isLoadingBooks: true,
  searchQuery: "",
  filterBy: "all",
  isSearching: false,
  bookDetails: null,
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilterBy: (filter: "all" | "author" | "title" | "status" | "year" | "codeBook") =>
    set({ filterBy: filter }),

  fetchBooks: async () => {
    set({ isLoadingBooks: true });
    try {
      const response = await fetch("http://localhost:3000/books");
      const data = await response.json();
      set({ books: data, filteredBooks: data });
    } catch (error) {
      console.error("error fetching books", error);
    } finally {
      set({ isLoadingBooks: false });
    }
  },

  fetchBookById: async (id: number) => {
    set({ isLoadingBooks: true });
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`);
      const json = await response.json();
      set({ bookDetails: json });
    } catch (error) {
      console.error("Error fetching book data:", error);
    } finally {
      set({ isLoadingBooks: false });
    }
  },

  createBook: async (newBook: Book) => {
    try {
      const response = await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      const addedBook = await response.json();
      set((state) => ({
        books: [...state.books, addedBook],
        filteredBooks: [...state.filteredBooks, addedBook],
      }));
    } catch (error) {
      console.error(error);
    }
  },

  handleDeleteBook: async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
        filteredBooks: state.filteredBooks.filter((book) => book.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  },

  editBook: async (id: number, updatedBook: Book) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error("Error updating book");
      }

      const newBook = await response.json();

      set((state) => ({
        books: state.books.map((book) => (book.id === id ? newBook : book)),
        filteredBooks: state.filteredBooks.map((book) =>
          book.id === id ? newBook : book,
        ),
      }));
    } catch (error) {
      console.error("Error updating book:", error);
    }
  },

  searchBooks: (q, filterBy) => {
    const query = q.trim().toLowerCase();
    const matchQuery = (str: string) => str.toString().toLowerCase().includes(query);
    const books = get().books;

    if (!query) {
      set({ filteredBooks: books });
      return;
    }

    const filteredBooks = books.filter((book) => {
      if (filterBy === "author") return matchQuery(book.author);
      if (filterBy === "title") return matchQuery(book.title);
      if (filterBy === "status") return matchQuery(book.status);
      if (filterBy === "year") return matchQuery(String(book.year));
      if (filterBy === "codeBook") return matchQuery(book.codeBook);
      return (
        matchQuery(book.author) ||
        matchQuery(book.title) ||
        matchQuery(book.status) ||
        book.year.toString().includes(query) ||
        book.codeBook.includes(query)
      );
    });

    set({ filteredBooks });
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
