import {
    defaultHandler,
    updateHandler,
    type RaPayload,
    getListHandler,
} from 'ra-data-simple-prisma';
import { prisma } from '#app/utils/db.server.ts';
import {
    transformOrderedListRequest,
    updateOrderHandler,
} from './utils/update-order.tsx';

export const technologyHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'update': {
            if (body.params.id?.toLowerCase() === 'list') {
                return await updateOrderHandler(body, prisma.technology);
            }
            return await updateHandler(body, prisma.technology);
        }
        case 'getList': {
            const transformedBody = transformOrderedListRequest(body);
            return await getListHandler(transformedBody, prisma.technology);
        }
        default:
            return await defaultHandler(body, prisma);
    }
};
