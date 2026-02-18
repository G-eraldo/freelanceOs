export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "No file uploaded" });
    }

    const file = formData[0];
    if (!file.data || !file.filename || !file.type) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid file data",
      });
    }

    // Save to database
    const attachment = await prisma.attachment.create({
      data: {
        filename: file.filename,
        mimeType: file.type,
        content: file.data, // This is a Buffer which Prisma maps to Bytes (bytea)
      },
    });

    return {
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
