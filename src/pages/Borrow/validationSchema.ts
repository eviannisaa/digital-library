import { z } from "zod";

export const validationSchema = z.object({
  codeBook: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Book cannot be empty",
  }),
  name: z.string().nonempty({ message: "Name cannot be empty." }),
  gender: z.string().nonempty({ message: "Gender cannot be empty." }),
  loanDate: z.string().nonempty({ message: "Loan Date cannot be empty." }),
  returnDate: z.string().nonempty({ message: "Return Date cannot be empty." }),
  totalItem: z.number().optional(),
  status: z.string(),
});

export const defaultValue = {
  codeBook: [],
  name: "",
  gender: "",
  loanDate: new Date().toISOString(),
  returnDate: "",
  totalItem: 0,
  status: "",
};
