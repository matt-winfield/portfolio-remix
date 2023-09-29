import {
    defaultHandler,
    updateHandler,
    type RaPayload,
    getListHandler,
} from 'ra-data-simple-prisma';
import { prisma } from '#app/utils/db.server.ts';

export const technologyHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'update': {
            if (body.params.id?.toLowerCase() === 'list') {
                const ids = body.params.data?.ids as string[] | undefined;

                if (!ids) {
                    return;
                }

                const promises = ids.map(async (id, index) => {
                    return await prisma.technology.update({
                        where: { id },
                        data: { order: index },
                    });
                });

                await Promise.all(promises);
                return { data: ids };
            }
            return await updateHandler(body, prisma.technology);
        }
        case 'getList': {
            const bodyWithSort = {
                ...body,
                params: {
                    ...body.params,
                    sort: { field: 'order', order: 'asc' },
                },
            };
            return await getListHandler(bodyWithSort, prisma.technology);
        }
        default:
            return await defaultHandler(body, prisma);
    }
};
