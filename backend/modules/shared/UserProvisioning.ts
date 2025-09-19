import { prisma } from "@/db/client";
import { hashPassword } from "@/utils/password";

function slugifyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .replace(/\.+/g, ".");
}

function randomDigits(n = 4) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

function generateRandomUsername(prefix = "parent") {
  const randomPart = randomDigits(6);
  return `${prefix}${randomPart}`;
}

async function generateUniqueUsername(base: string) {
  let candidate = base;
  let counter = 0;
  // try base first; if exists, append random digits until unique
  // keep a safety cap
  while (counter < 50) {
    const exists = await prisma.user.findUnique({
      where: { username: candidate },
    });
    if (!exists) return candidate;
    candidate = `${base}.${randomDigits(4)}`;
    counter++;
  }
  // As a last resort include timestamp
  return `${base}.${Date.now()}`;
}

export async function provisionUserForEntity(args: {
  name: string;
  email?: string;
  phone?: string;
  roleName?: "student" | "parent" | "teacher" | "admin" | "employee";
}) {
  let username: string;
  let defaultPassword: string;

  // Special handling for parents: random username and fixed password
  if (args.roleName === "parent") {
    const randomBase = generateRandomUsername("parent");
    username = await generateUniqueUsername(randomBase);
    defaultPassword = "parent123";
  } else {
    // Default behavior for other roles
    const base = slugifyName(args.name || "user");
    username = await generateUniqueUsername(base);
    defaultPassword = `${username}123`;
  }

  const user = await prisma.user.create({
    data: {
      name: args.name,
      username,
      password: hashPassword(defaultPassword),
      email: args.email,
      phone: args.phone,
    },
  });

  // Attach role if exists in Role table (m2m)
  const map: Record<string, string> = {
    student: "student",
    parent: "parent",
    teacher: "teacher",
    admin: "admin",
    employee: "employee",
  };
  const roleKey = args.roleName && map[args.roleName];
  if (roleKey) {
    const role = await prisma.role.findUnique({ where: { name: roleKey } });
    if (role) {
      await prisma.user.update({
        where: { id: user.id },
        data: { roles: { connect: { id: role.id } } },
      });
    }
  }

  return {
    user,
    credentials: { username, password: defaultPassword },
  };
}
