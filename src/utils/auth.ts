import { User } from "../types/user";
import { encryptPassword, decryptPassword } from "./encryption";

const defaultUsers: User[] = [
  {
    id: 1,
    firstName: "Umang",
    lastName: "Panchal",
    email: "umang@gmail.com",
    mobile: "1234567890",
    password: encryptPassword("Password@123"),
  },
  {
    id: 2,
    firstName: "Pruthvi",
    lastName: "Darji",
    email: "pruthvi@gmail.com",
    mobile: "1111111111",
    password: encryptPassword("Secure@456"),
  },
  {
    id: 3,
    firstName: "Demo",
    lastName: "User",
    email: "demo@gmail.com",
    mobile: "2222222222",
    password: encryptPassword("MyPass@789"),
  },
];

const initializeUsers = (): void => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};

export const signupUser = (userData: User): void => {
  initializeUsers();
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
  initializeUsers();
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