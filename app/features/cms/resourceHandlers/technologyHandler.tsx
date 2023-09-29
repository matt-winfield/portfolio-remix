import {
    defaultHandler,
    updateHandler,
    type RaPayload,
    getListHandler,
} from 'ra-data-simple-prisma';
import { prisma } from '#app/utils/db.server.ts';
import { updateOrderHandler } from './utils/update-order.tsx';

export const technologyHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'update': {
            if (body.params.id?.toLowerCase() === 'list') {
                return await updateOrderHandler(body, prisma.technology);
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
