import { prisma } from '#app/utils/db.server.ts';
import {
    createHandler,
    defaultHandler,
    getListHandler,
    getOneHandler,
    updateHandler,
    type RaPayload,
} from 'ra-data-simple-prisma';

export const noteHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'create': {
            return await createHandler(body, prisma.note, {
                connect: {
                    imageIds: {
                        images: 'id',
                    },
                },
            });
        }
        case 'getList': {
            return await getListHandler(body, prisma.note, {
                include: {
                    images: {
                        select: {
                            id: true,
                        },
                    },
                },
                map: (notes) =>
                    notes.map((note: any) => ({
                        ...note,
                        imageIds: note.images?.map((image: any) => image.id),
                    })),
            });
        }
        case 'getOne': {
            return await getOneHandler(body, prisma.note, {
                include: {
                    images: {
                        select: {
                            id: true,
                        },
                    },
                },
                transform: (note) => {
                    note.imageIds = note.images?.map((image: any) => image.id);
                },
            });
        }
        case 'update': {
            return await updateHandler(body, prisma.note, {
                set: {
                    imageIds: {
                        images: 'id',
                    },
                },
            });
        }
        default:
            return await defaultHandler(body, prisma);
    }
};
