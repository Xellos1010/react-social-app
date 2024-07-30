import { z } from "zod"

// TODO: Implement multi-lingual
export const SignupValidationSchema = z.object({
    name: z.string().min(2, {message: 'Name must be atleast 2 characters short'}),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }).max(50),
    email: z.string().email({ message: 'Invalid email'}),
    // TODO: Add Password validation for atleast (8 characters, 1 Capitol letter, 1 symbol)
    password: z.string().min(8, { message: 'Password must be atleast 8 characters'})
  })

  export const SigninValidationSchema = z.object({
    email: z.string().email({ message: 'Invalid email'}),
    // TODO: Add Password validation for atleast (8 characters, 1 Capitol letter, 1 symbol)
    password: z.string().min(8, { message: 'Password must be atleast 8 characters'})
  })