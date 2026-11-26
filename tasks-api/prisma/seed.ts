import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma.js";

async function main() {
  const email = process.env.SEED_EDITOR_EMAIL;
  const password = process.env.SEED_EDITOR_PASSWORD;

  if (!email || !password) {
    throw new Error("Defina SEED_EDITOR_EMAIL e SEED_EDITOR_PASSWORD no .env");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Editor", email, passwordHash, role: "EDITOR" },
  });

  console.log("Primeiro Editor pronto:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());