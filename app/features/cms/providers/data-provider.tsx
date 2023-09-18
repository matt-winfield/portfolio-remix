import { dataProvider as prismaDataProvider } from 'ra-data-simple-prisma';
import { withLifecycleCallbacks, type DataProvider } from 'react-admin';

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

type Options = Parameters<typeof prismaDataProvider>[1];

export const dataProviderImplementation = (
    apiUrl: string,
    options?: Options,
): DataProvider => {
    const prismaProvider = prismaDataProvider(apiUrl, options);

    return {
        getList: (resource, params) => {
            return prismaProvider.getList(resource, params);
        },
        getOne: (resource, params) => {
            return prismaProvider.getOne(resource, params);
        },
        getMany: (resource, params) => {
            return prismaProvider.getMany(resource, params);
        },
        getManyReference: (resource, params) => {
            return prismaProvider.getManyReference(resource, params);
        },
        create: (resource, params) => {
            return prismaProvider.create(resource, params);
        },
        update: (resource, params) => {
            return prismaProvider.update(resource, params);
        },
        updateMany: (resource, params) => {
            return prismaProvider.updateMany(resource, params);
        },
        delete: (resource, params) => {
            return prismaProvider.delete(resource, params);
        },
        deleteMany: (resource, params) => {
            return prismaProvider.deleteMany(resource, params);
        },
    };
};

export const dataProvider = (apiUrl: string, options?: Options) =>
    withLifecycleCallbacks(dataProviderImplementation(apiUrl, options), [
        {
            resource: 'NoteImage',
            beforeSave: async (data) => {
                const image = data.src.rawFile as File;

                if (image) {
                    const base64 = await convertFileToBase64(image);
                    data.src = base64;
                }

                return data;
            },
        },
        {
            resource: 'Image',
            beforeSave: async (data) => {
                const image = data.src.rawFile as File;

                if (image) {
                    const base64 = await convertFileToBase64(image);
                    data.src = base64;
                }

                return data;
            },
        },
        {
            resource: 'Qualification',
            beforeSave: async (data) => {
                const dateString = data.date as string;

                if (dateString) {
                    data.date = new Date(dateString).toISOString();
                }

                return data;
            },
        },
    ]);
