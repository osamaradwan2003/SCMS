import { prisma } from "@/db/client";
import { hashPassword } from "@/utils/password";

function createUser(
  name: string,
  username: string,
  password: string,
  email: string,
  phone: string
) {
  return prisma.user
    .create({
      data: {
        name,
        username,
        password,
        email,
        phone,
      },
    })
    .then((v) => console.log(v))
    .catch((e) => console.log(e));
}

createUser(
  "osama amin",
  "admin",
  hashPassword("admin123"),
  "osamaamin@gmail.com",
  "+201092215098"
);
