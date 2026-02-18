export default defineEventHandler(async (event) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map database fields to frontend structure (nest steps)
    return projects.map((p) => ({
      ...p,
      steps: {
        sent: p.sent,
        signed: p.signed,
        deposit: p.deposit,
        done: p.done,
      },
    }));
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
