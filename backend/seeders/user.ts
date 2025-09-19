import { prisma } from "@/db/client";
import { hashPassword } from "@/utils/password";

async function seedSuperAdmin() {
  const username = "superadmin";
  const name = "Super Admin";
  const email = "superadmin@example.com";
  const phone = "+0000000000";
  const password = hashPassword(process.env.SUPERADMIN_PASSWORD || "superadmin123");

  // Upsert the superadmin user (idempotent)
  const user = await prisma.user.upsert({
    where: { username },
    update: { name, email, phone, password },
    create: { name, username, email, phone, password },
  });

  // Attach superadmin role if present
  const superAdminRole = await prisma.role.findUnique({ where: { name: "superadmin" } });
  if (superAdminRole) {
    await prisma.user.update({
      where: { id: user.id },
      data: { roles: { connect: [{ id: superAdminRole.id }] } },
    });
  }

  console.log("Seeded superadmin user:", { id: user.id, username });
}

seedSuperAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
