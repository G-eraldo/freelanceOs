import { decrypt } from "~~/server/utils/crypto";

export default defineEventHandler(async () => {
  const credentials = await prisma.credential.findMany({
    include: { fields: true },
    orderBy: { createdAt: "desc" },
  });

  return credentials.map((c) => ({
    ...c,
    fields: c.fields.map((f) => ({
      ...f,
      value: f.isSecret ? "••••••••" : decrypt(f.value),
    })),
  }));
});
