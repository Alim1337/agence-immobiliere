export type Role = "ADMIN" | "AGENT" | "ASSISTANT";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string; // ⚠️ plaintext demo only — replace with bcrypt hash + DB lookup
  role: Role;
}

// Mirrors src/lib/mock-data.ts agents (a1, a2, a3) + one assistant for role demo.
// Password for every demo account: "demo1234"
export const demoUsers: DemoUser[] = [
  {
    id: "a1",
    name: "Claire Vasseur",
    email: "claire.vasseur@maisonetfils.fr",
    password: "demo1234",
    role: "ADMIN",
  },
  {
    id: "a2",
    name: "Nadir Belkacem",
    email: "nadir.belkacem@maisonetfils.fr",
    password: "demo1234",
    role: "AGENT",
  },
  {
    id: "a3",
    name: "Émilie Roussel",
    email: "emilie.roussel@maisonetfils.fr",
    password: "demo1234",
    role: "AGENT",
  },
  {
    id: "a4",
    name: "Yanis Cherfi",
    email: "yanis.cherfi@maisonetfils.fr",
    password: "demo1234",
    role: "ASSISTANT",
  },
];

export function findDemoUser(email: string, password: string) {
  return demoUsers.find((u) => u.email === email && u.password === password);
}
