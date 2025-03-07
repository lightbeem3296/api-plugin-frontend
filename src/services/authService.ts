import { User } from "@/types/auth";
import axios from "axios";

export const fetchCurrentUser = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get<User>("/api/user/ping", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const user = response.data;
    saveCurrentUser(user);
    return user;
  } catch {
    console.log("authentication error");
  }
  return null;
}

export const loadCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch {
    console.error("Failed to load current user from local storage");
  }
  return null;
}

export const saveCurrentUser = (user: User) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
