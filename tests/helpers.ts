import { prisma } from "@/config";

export async function cleanDb() {
  await prisma.user.deleteMany({});
  await prisma.relationship.deleteMany({});
}
