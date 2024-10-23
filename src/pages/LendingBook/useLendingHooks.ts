import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValue, validationSchema } from "./validationSchema";
import { useBorrowStore } from "@/store/useBorrowStore";
import { z } from "zod";

export const useLandingHooks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addUserBorrow, userDetails, editUserBorrow } = useBorrowStore();

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValue,
    mode: "onSubmit",
  });

  const onAddedLending = async (values: z.infer<typeof validationSchema>) => {
    try {
      await addUserBorrow({
        ...values,
        id: Math.floor(Math.random() * 1000),
        totalDays: 0,
      });
      form.reset();
      toast({
        title: "Success!",
        description: "The user has been added successfully.",
      });
      navigate("/lending-book");
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

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

  const onUpdatedLending = async (data: any) => {
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

  return {
    listMenus,
    formMenus,
    form,
    onAddedLending,
    onUpdatedLending,
    id,
    updateMenus,
  };
};
