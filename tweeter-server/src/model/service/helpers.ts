import { compare } from "bcryptjs"

export const isValidPassword = async (enteredPassword: string, hashedPassword: string | null): Promise<boolean> => {
  if (hashedPassword === null) {
    return false
  }
  
  return await compare(enteredPassword, hashedPassword)
}