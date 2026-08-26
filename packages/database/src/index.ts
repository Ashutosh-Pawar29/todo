import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, "../.env");
  dotenv.config({ path: envPath });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Set it in the environment or in packages/database/.env"
  );
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });