import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;
export function connectPrisma(): void {
  if (prisma) {
    return;
  }

  prisma = new PrismaClient();
}

export async function disconnectPrisma(): Promise<void> {
  await prisma?.$disconnect();
}
