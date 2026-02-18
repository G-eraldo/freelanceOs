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

    // Encode filename for Content-Disposition (handles accents & special chars)
    const safeFilename = attachment.filename.replace(/[^\x20-\x7E]/g, "_");
    const encodedFilename = encodeURIComponent(attachment.filename);

    // Set headers for PDF viewing
    setResponseHeaders(event, {
      "Content-Type": attachment.mimeType,
      "Content-Disposition": `inline; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
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
