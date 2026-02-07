import { User, Project } from "./types";

export const currentUser: User = {
  id: "u1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "JD",
};

export const users: User[] = [
  { id: "u1", name: "John Doe", avatar: "JD" },
  { id: "u2", name: "Alice Smith", avatar: "AS" },
  { id: "u3", name: "Bob Johnson", avatar: "BJ" },
];

export const projects: Project[] = [
  {
    id: "1",
    name: "Platform Redesign",
    color: "#10b981",
    taskCount: 12,
  },
  {
    id: "2",
    name: "Mobile App",
    color: "#3b82f6",
    taskCount: 8,
  },
  {
    id: "3",
    name: "Marketing Site",
    color: "#f59e0b",
    taskCount: 5,
  },
];
