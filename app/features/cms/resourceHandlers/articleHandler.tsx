import {
    createHandler,
    defaultHandler,
    getListHandler,
    getOneHandler,
    updateHandler,
    type RaPayload,
} from 'ra-data-simple-prisma';
import { prisma } from '#app/utils/db.server.ts';

export const articleHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'create': {
            return await createHandler(body, prisma.article, {
                connect: {
                    imageIds: {
                        images: 'id',
                    },
                },
            });
        }
        case 'getList': {
            return await getListHandler(body, prisma.article, {
                include: {
                    images: {
                        select: {
                            id: true,
                        },
                    },
                },
                map: (articles) =>
                    articles.map((note: any) => ({
                        ...note,
                        imageIds: note.images?.map((image: any) => image.id),
                    })),
            });
        }
        case 'getOne': {
            return await getOneHandler(body, prisma.article, {
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
            return await updateHandler(body, prisma.article, {
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
