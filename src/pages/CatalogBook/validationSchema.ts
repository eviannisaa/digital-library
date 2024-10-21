import { z } from "zod";

export const validationSchema = z.object({
  codeBook: z.string().nonempty({ message: "Code Book cannot be empty." }),
  author: z.string().nonempty({ message: "Author cannot be empty." }),
  title: z.string().nonempty({ message: "Title cannot be empty." }),
  description: z.string().nonempty({ message: "Description cannot be empty." }),
  year: z.string().nonempty({ message: "Year cannot be empty." }),
  price: z.string().optional(),
  coverBook: z.string().nonempty({ message: "Cover Book cannot be empty." }),
});

export const defaultValue = {
  author: "",
  title: "",
  description: "",
  year: "",
  price: "",
  coverBook: "",
  codeBook: "",
};
