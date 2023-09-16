import { noteHandler } from '#app/features/cms/resourceHandlers/noteHandler.tsx';
import { noteImageHandler } from '#app/features/cms/resourceHandlers/noteImageHandler.tsx';
import { projectHandler } from '#app/features/cms/resourceHandlers/projectHandler.tsx';
import { userHandler } from '#app/features/cms/resourceHandlers/userHandler.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { requireUserWithRole } from '#app/utils/permissions.ts';
import { json, type DataFunctionArgs } from '@remix-run/server-runtime';
import { defaultHandler, type RaPayload } from 'ra-data-simple-prisma';

const mapImagePropertiesInArray = (data: Array<any>) => {
    const output = [] as Array<any>;

    for (const item of data) {
        if (item !== null && typeof item === 'object') {
            output.push(mapImageProperties(item));
            continue;
        }

        output.push(item);
    }

    return output;
};

const mapImageProperties = (data: any) => {
    if (Array.isArray(data)) {
        return mapImagePropertiesInArray(data);
    }

    const output = {} as Record<string, any>;

    for (const key in data) {
        const value = data[key] as any | Array<any>;

        if (value instanceof Uint8Array) {
            const contentType = data.contentType ?? 'image/png';
            const base64 = Buffer.from(value).toString('base64');
            const src = `data:${contentType};base64,${base64}`;
            output['src'] = src;
            continue;
        }

        if (
            value !== null &&
            (typeof value === 'object' || Array.isArray(value))
        ) {
            output[key] = mapImageProperties(value);
            continue;
        }

        output[key] = value;
    }
    return output;
};

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
