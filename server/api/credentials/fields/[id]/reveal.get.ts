import { decrypt } from "~~/server/utils/crypto";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID is required" });

  const field = await prisma.credentialField.findUnique({
    where: { id },
  });

  if (!field)
    throw createError({ statusCode: 404, message: "Field not found" });

  const decrypted = decrypt(field.value);

  if (!decrypted && field.value) {
    throw createError({
      statusCode: 500,
      message: "Failed to decrypt secret value. Check ENCRYPTION_KEY.",
    });
  }

  return { value: decrypted };
});
