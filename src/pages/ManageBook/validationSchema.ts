import { z } from "zod";

export const validationSchema = z.object({
  codeBook: z
    .string()
    .max(3)
    .nonempty({ message: "Code Book cannot be empty." }),
  author: z.string().nonempty({ message: "Author cannot be empty." }),
  title: z.string().nonempty({ message: "Title cannot be empty." }),
  description: z.string().nonempty({ message: "Description cannot be empty." }),
  year: z.coerce
    .number({
      invalid_type_error: "Year must be a number",
    })
    .refine((value) => value !== undefined && value !== null && value !== 0, {
      message: "Year cannot be empty.",
    }),
  price: z.coerce.number({
    invalid_type_error: "Price must be a number",
  }),
  coverBook: z.string().nonempty({ message: "Cover Book cannot be empty." }),
  status: z.string(),
  isbn: z.string(),
});

export const defaultValue = {
  author: "",
  title: "",
  description: "",
  year: undefined,
  price: 0,
  coverBook: "",
  codeBook: "",
  status: "",
  isbn: "",
};
