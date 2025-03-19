import { User } from "../types/user";
import { encryptPassword, decryptPassword } from "./encryption";

export const signupUser = (userData: User): void => {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const emailExists = users.some((user) => user.email === userData.email);

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const encryptedUser = {
    ...userData,
    password: encryptPassword(userData.password),
  };

  users.push(encryptedUser);
  localStorage.setItem("users", JSON.stringify(users));
};

export const loginUser = (email: string, password: string): User => {
  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email);

  if (!user) throw new Error("Email not found");
  if (decryptPassword(user.password) !== password)
    throw new Error("Invalid password");

  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("currentUser");
};

export const logoutUser = (): void => {
  localStorage.removeItem("currentUser");
};