import { encrypt } from "~~/server/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const credential = await prisma.credential.create({
    data: {
      label: body.label,
      category: body.category ?? "service",
      clientName: body.clientName ?? null,
      fields: {
        create: body.fields.map((f: any) => ({
          key: f.key,
          value: encrypt(f.value),
          isSecret: f.isSecret ?? false,
        })),
      },
    },
    include: { fields: true },
  });

  return credential;
});
