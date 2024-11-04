import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValue, validationSchema } from "./validationSchema";
import { useBorrowStore } from "@/store/useBorrowStore";
import { z } from "zod";

export const useLandingHooks = () => {
  /*  -------------------------------- STATE --------------------------------- */

  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addUserBorrow, editUserBorrow, userDetails } = useBorrowStore();

  const userBorrowId = JSON.parse(localStorage.getItem("lastIdUserBorrow")!);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValue,
    mode: "onSubmit",
  });

  /* --------------------------- HANDLER FUNCTIONS --------------------------- */

  const onSubmitAddedUserBorrow = async (
    values: z.infer<typeof validationSchema>,
  ) => {
    try {
      await addUserBorrow({
        ...values,
        id: userBorrowId + 1,
        totalDays: 0,
      });
      form.reset();
      toast({
        title: "Success!",
        description: "The user has been added successfully.",
      });
      navigate("/lending-book");
    } catch (error) {
      toast({
        title: "Failed!",
        description: `Error adding users:${error}`,
      });
    }
  };

  const onSubmitUpdatedUserBook = async (data: any) => {
    try {
      await editUserBorrow(Number(id), data);
      toast({
        title: "Success!",
        description: "The users has been successfully updated.",
      });
      navigate("/lending-book");
    } catch (error) {
      toast({
        title: "Failed!",
        description: `Error updating users:${error}`,
      });
    }
  };

  /* ----------------------------- EFFECT HANDLER ---------------------------- */

  useEffect(() => {
    if (userDetails) {
      form.reset({
        name: userDetails?.name ?? "",
        gender: userDetails?.gender ?? "",
        lendingDate: userDetails?.lendingDate ?? "",
        returnDate: userDetails?.returnDate ?? "",
        totalBooks: userDetails?.totalBooks ?? 0,
        contact: userDetails?.contact ?? "",
        codeBook: userDetails?.codeBook ?? "",
        status: userDetails?.status ?? "",
      });
    }
  }, [form, userDetails]);

  /* --------------------------------- MENU --------------------------------- */

  const listMenus = [
    {
      label: "Catalog Book",
      active: false,
      to: "/catalog-book",
    },
    {
      label: "Lending",
      active: true,
    },
  ];

  const formMenus = [
    {
      label: "Lending Book",
      active: false,
      to: "/lending-book",
    },
    {
      label: "Form",
      active: true,
    },
  ];

  const updateMenus = [
    {
      label: "Lending Book",
      active: false,
      to: "/lending-book",
    },
    {
      label: "Updated",
      active: true,
    },
  ];

  /* ------------------------------ STYLING LOGIC ---------------------------- */

  const getStatusStyles = (status: string) => {
    let variant: "default" | "destructive" | "secondary";
    let text: string;

    switch (status) {
      case "not yet returned":
        variant = "default";
        text = "Not Yet Returned";
        break;
      case "returned":
        variant = "secondary";
        text = "Returned";
        break;
      default:
        variant = "destructive";
        text = "Reserved";
        break;
    }

    return { variant, text };
  };

  /* ---------------------------------- RETURN ------------------------------- */

  return {
    id,
    form,
    listMenus,
    formMenus,
    onSubmitAddedUserBorrow,
    onSubmitUpdatedUserBook,
    updateMenus,
    getStatusStyles,
  };
};
