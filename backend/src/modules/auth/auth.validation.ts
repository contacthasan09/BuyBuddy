import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});