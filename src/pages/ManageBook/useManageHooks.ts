import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBooksStore } from "@/store/useBookStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValue, validationSchema } from "./validationSchema";
import { z } from "zod";

export const useManageHooks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createBook, editBook, bookDetails } = useBooksStore();
  const { id } = useParams<{ id: string }>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValue,
    mode: "onSubmit",
  });

  const onSubmitCreatedBook = async (
    values: z.infer<typeof validationSchema>,
  ) => {
    try {
      await createBook({
        ...values,
        id: Math.floor(Math.random() * 1000),
        genre: "",
      });

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Success!",
        description: "The book has been added successfully.",
      });

      navigate("/catalog-book/manage");
    } catch (error) {
      toast({
        title: "Failed!",
        description: `Failed to add book: ${error}`,
      });
    }
  };

  useEffect(() => {
    if (bookDetails) {
      form.reset({
        author: bookDetails?.author ?? "",
        title: bookDetails?.title ?? "",
        description: bookDetails?.description ?? "",
        year: bookDetails?.year ?? 0,
        price: bookDetails?.price ?? 0,
        coverBook: bookDetails?.coverBook ?? "",
        codeBook: bookDetails?.codeBook ?? "",
        isbn: bookDetails?.isbn ?? "",
      });
    }
  }, [form, bookDetails]);

  const onSubmitEditedBook = async (data: any) => {
    try {
      await editBook(Number(id), data);
      toast({
        title: "Success!",
        description: "The book has been successfully updated.",
      });

      navigate("/catalog-book/manage");
    } catch (error) {
      toast({
        title: "Failed!",
        description: `Error updating book:${error}`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-600";
      case "Borrowed":
        return "bg-yellow-600";
      case "Reserved":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  const createMenus = [
    {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
    },
    {
      label: "Manage",
      active: false,
      to: "/catalog-book/manage",
    },
    {
      label: "Created Book",
      active: true,
    },
  ];

  const editMenus = [
    {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
    },
    {
      label: "Manage",
      active: false,
      to: "/catalog-book/manage",
    },
    {
      label: "Updated Book",
      active: true,
    },
  ];

  const listMenus = [
    {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
    },
    {
      label: "Manage",
      active: true,
    },
  ];

  return {
    form,
    onSubmitCreatedBook,
    fileInputRef,
    createMenus,
    editMenus,
    listMenus,
    onSubmitEditedBook,
    getStatusColor,
    id,
  };
};