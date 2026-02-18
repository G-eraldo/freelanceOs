export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "ID is required" });

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Attachment not found",
      });
    }

    // Set headers for PDF viewing
    setResponseHeaders(event, {
      "Content-Type": attachment.mimeType,
      "Content-Disposition": `inline; filename="${attachment.filename}"`,
      "Content-Length": attachment.content.length.toString(),
    });

    return attachment.content;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
