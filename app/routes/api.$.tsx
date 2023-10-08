import { json, type DataFunctionArgs } from '@remix-run/server-runtime';
import { defaultHandler, type RaPayload } from 'ra-data-simple-prisma';
import { articleHandler } from '#app/features/cms/resourceHandlers/articleHandler.tsx';
import { imageHandler } from '#app/features/cms/resourceHandlers/imageHandler.tsx';
import { noteHandler } from '#app/features/cms/resourceHandlers/noteHandler.tsx';
import { noteImageHandler } from '#app/features/cms/resourceHandlers/noteImageHandler.tsx';
import { projectHandler } from '#app/features/cms/resourceHandlers/projectHandler.tsx';
import { technologyHandler } from '#app/features/cms/resourceHandlers/technologyHandler.tsx';
import { userHandler } from '#app/features/cms/resourceHandlers/userHandler.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { requireUserWithRole } from '#app/utils/permissions.ts';

export const loader = async ({ request }: DataFunctionArgs) => {
    await requireUserWithRole(request, 'admin');
    const body = (await request.json()) as RaPayload;

    switch (body.resource.toLowerCase()) {
        case 'user': {
            const result = await userHandler(body);
            return json(result);
        }
        case 'project': {
            const result = await projectHandler(body);
            return json(result);
        }
        case 'technology': {
            const result = await technologyHandler(body);
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
        case 'article': {
            const result = await articleHandler(body);
            return json(result);
        }
    }

    const result = await defaultHandler(body, prisma);

    return json(result);
};

export const action = loader;
