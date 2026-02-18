export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) throw createError({ statusCode: 400, message: "ID is required" });

    const project = await prisma.project.update({
      where: { id },
      data: {
        client: body.client,
        name: body.name,
        amount: body.amount,
        date: body.date,
        tags: body.tags,
        devisId: body.devisId || null,
        cgvId: body.cgvId || null,
        hasMaintenance: body.hasMaintenance,
        maintAmount: body.maintAmount,
        maintDate: body.maintDate,
        notes: body.notes,
        sent: body.steps?.sent,
        signed: body.steps?.signed,
        deposit: body.steps?.deposit,
        done: body.steps?.done,
      },
    });

    return {
      ...project,
      steps: {
        sent: project.sent,
        signed: project.signed,
        deposit: project.deposit,
        done: project.done,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
