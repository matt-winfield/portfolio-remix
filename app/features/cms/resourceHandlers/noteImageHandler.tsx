import { prisma } from '#app/utils/db.server.ts';
import {
    createHandler,
    defaultHandler,
    updateHandler,
    type CreateRequest,
    type RaPayload,
    type UpdateRequest,
} from 'ra-data-simple-prisma';

export const transformRequestBody = async <
    T extends CreateRequest | UpdateRequest,
>(
    body: T,
) => {
    const dataUrl = body.params.data.src as string | undefined;

    const newData = {
        ...body.params.data,
    };

    if (dataUrl) {
        // Replace the dataUrl with a blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        newData.contentType = blob.type;
        newData.blob = Buffer.from(await blob.arrayBuffer());
        delete newData.src;
    }

    return {
        ...body,
        params: {
            ...body.params,
            data: newData,
        },
    };
};

const transformImagePropertiesInArray = (data: Array<any>) => {
    const output = [] as Array<any>;

    for (const item of data) {
        if (item !== null && typeof item === 'object') {
            output.push(transformResponseProperties(item));
            continue;
        }

        output.push(item);
    }

    return output;
};

const transformResponseProperties = (data: any) => {
    if (Array.isArray(data)) {
        return transformImagePropertiesInArray(data);
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
            output[key] = transformResponseProperties(value);
            continue;
        }

        output[key] = value;
    }
    return output;
};

export const noteImageHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'create': {
            const transformedBody = await transformRequestBody(body);
            return await createHandler(transformedBody, prisma.noteImage);
        }
        case 'update': {
            const transformedBody = await transformRequestBody(body);
            return await updateHandler(transformedBody, prisma.noteImage);
        }
        default:
            return transformResponseProperties(
                await defaultHandler(body, prisma),
            );
    }
};
