import { prisma } from '#app/utils/db.server.ts';
import {
    createHandler,
    defaultHandler,
    getListHandler,
    getOneHandler,
    updateHandler,
    type RaPayload,
} from 'ra-data-simple-prisma';

export const projectHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'create': {
            return await createHandler(body, prisma.project, {
                connect: {
                    technologyIds: {
                        technologies: 'id',
                    },
                    imageIds: {
                        images: 'id',
                    },
                },
            });
        }
        case 'getList': {
            return await getListHandler(body, prisma.project, {
                include: {
                    images: {
                        select: {
                            id: true,
                        },
                    },
                    technologies: {
                        select: {
                            id: true,
                        },
                    },
                },
                map: (projects) =>
                    projects.map((note: any) => ({
                        ...note,
                        imageIds: note.images?.map((image: any) => image.id),
                        technologyIds: note.technologies?.map(
                            (technology: any) => technology.id,
                        ),
                    })),
            });
        }
        case 'getOne': {
            return await getOneHandler(body, prisma.project, {
                include: {
                    images: {
                        select: {
                            id: true,
                        },
                    },
                    technologies: {
                        select: {
                            id: true,
                        },
                    },
                },
                transform: (note) => {
                    note.imageIds = note.images?.map((image: any) => image.id);
                    note.technologyIds = note.technologies?.map(
                        (technology: any) => technology.id,
                    );
                },
            });
        }
        case 'update': {
            return await updateHandler(body, prisma.project, {
                set: {
                    imageIds: {
                        images: 'id',
                    },
                    technologyIds: {
                        technologies: 'id',
                    },
                },
            });
        }
        default:
            return await defaultHandler(body, prisma);
    }
};
