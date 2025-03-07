import { extractKeys } from "@/utils/record"

export enum UserRole {
  INACTIVE = "inactive",
  USER = "user",
}
export const userRoleFieldMap: Record<string, string> = {
  "inactive": "Inactive",
  "user": "User",
}
export const userRoleFieldCodes = extractKeys(userRoleFieldMap);


export interface User {
  username: string
  role: UserRole
}

export interface Token {
  access_token: string
  token_type: string
}


export interface ChangePasswordRequest {
  new_password: string
}
