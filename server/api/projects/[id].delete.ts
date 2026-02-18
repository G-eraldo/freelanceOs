export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) throw createError({ statusCode: 400, message: "ID is required" });

    await prisma.project.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
