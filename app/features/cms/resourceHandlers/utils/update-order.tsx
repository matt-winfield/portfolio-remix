import { type UpdateRequest } from 'ra-data-simple-prisma';

export const updateOrderHandler = async (
    body: UpdateRequest,
    model: {
        update: Function;
    },
) => {
    const ids = body.params.data?.ids as string[] | undefined;

    if (!ids) {
        return;
    }

    const promises = ids.map(async (id, index) => {
        return await model.update({
            where: { id },
            data: { order: index },
        });
    });

    await Promise.all(promises);
    return { data: ids };
};
