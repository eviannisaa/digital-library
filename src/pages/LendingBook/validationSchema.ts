import { z } from "zod";

export const validationSchema = z.object({
  codeBook: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Book cannot be empty",
  }),
  name: z.string().nonempty({ message: "Name cannot be empty." }),
  gender: z.string().nonempty({ message: "Gender cannot be empty." }),
  lendingDate: z
    .string()
    .nonempty({ message: "Lending Date cannot be empty." }),
  returnDate: z.string().nonempty({ message: "Return Date cannot be empty." }),
  totalBooks: z.number().optional(),
  status: z.string(),
  contact: z.string().nonempty({ message: "Contact cannot be empty." }),
});

export const defaultValue = {
  codeBook: [],
  name: "",
  gender: "",
  lendingDate: new Date().toISOString(),
  returnDate: "",
  totalBooks: 0,
  status: "",
  contact: "",
};
