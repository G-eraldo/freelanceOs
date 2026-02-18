export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const project = await prisma.project.create({
      data: {
        client: body.client,
        name: body.name,
        amount: body.amount,
        date: body.date,
        tags: body.tags,
        devisId: body.devisId,
        cgvId: body.cgvId,
        hasMaintenance: body.hasMaintenance,
        maintAmount: body.maintAmount,
        maintDate: body.maintDate,
        notes: body.notes,
        sent: body.steps?.sent ?? false,
        signed: body.steps?.signed ?? false,
        deposit: body.steps?.deposit ?? false,
        done: body.steps?.done ?? false,
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
