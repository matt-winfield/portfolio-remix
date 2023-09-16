import { imageHandler } from '#app/features/cms/resourceHandlers/imageHandler.tsx';
import { noteHandler } from '#app/features/cms/resourceHandlers/noteHandler.tsx';
import { noteImageHandler } from '#app/features/cms/resourceHandlers/noteImageHandler.tsx';
import { projectHandler } from '#app/features/cms/resourceHandlers/projectHandler.tsx';
import { userHandler } from '#app/features/cms/resourceHandlers/userHandler.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { requireUserWithRole } from '#app/utils/permissions.ts';
import { json, type DataFunctionArgs } from '@remix-run/server-runtime';
import { defaultHandler, type RaPayload } from 'ra-data-simple-prisma';

export const loader = async ({ request }: DataFunctionArgs) => {
    await requireUserWithRole(request, 'admin');
    const body = (await request.json()) as RaPayload;

    let options = undefined;
    switch (body.resource.toLowerCase()) {
        case 'user': {
            const result = await userHandler(body);
            return json(result);
        }
        case 'project': {
            const result = await projectHandler(body);
            return json(result);
        }
        case 'image': {
            const result = await imageHandler(body);
            return json(result);
        }
        case 'note': {
            const result = await noteHandler(body);
            return json(result);
        }
        case 'noteimage': {
            const result = await noteImageHandler(body);
            return json(result);
        }
    }

    const result = await defaultHandler(body, prisma, {
        getOne: options,
        getList: options,
        getMany: options,
        update: options,
        create: options,
        getManyReference: options,
    });

    return json(result);
};

export const action = loader;
