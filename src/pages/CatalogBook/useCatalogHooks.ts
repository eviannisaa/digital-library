import { useState } from "react";
import { useBooksStore } from "@/store/useBookStore";
import { useNavigate, useParams } from "react-router-dom";

export const useCatalogHooks = () => {
  /*  -------------------------------- STATE --------------------------------- */
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const { filteredBooks } = useBooksStore();
  const navigate = useNavigate();

  /* --------------------------- HANDLER FUNCTIONS --------------------------- */

  const itemsPerPage = 10;
  const displayedBooks = filteredBooks.slice(0, currentPage * itemsPerPage);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  /* ---------------------------------- MENU ---------------------------------- */

  const menus = [
    {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
    },
    {
      label: "Detail Book",
      active: true,
      to: "/catalog-book",
    },
  ];

  /* ------------------------------ STYLING LOGIC ---------------------------- */

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Available":
        return { text: "text-green-600", bg: "bg-green-600" };
      case "Borrowed":
        return { text: "text-yellow-600", bg: "bg-yellow-600" };
      case "Reserved":
        return { text: "text-red-600", bg: "bg-red-600" };
      default:
        return { text: "text-gray-400", bg: "bg-gray-200" };
    }
  };

  /* ----------------------------- HELPER FUNCTION --------------------------- */

  const formatPrice = (price: number) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "$0.00";
    }
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  /* ---------------------------------- RETURN ------------------------------- */

  return {
    id,
    navigate,
    menus,
    formatPrice,
    getStatusStyles,
    displayedBooks,
    handleLoadMore,
  };
};
