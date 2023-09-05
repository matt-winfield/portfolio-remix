import { dataProvider as prismaDataProvider } from 'ra-data-simple-prisma';
import { type DataProvider } from 'react-admin';

type Options = Parameters<typeof prismaDataProvider>[1] & {
    transform: (data: any) => any;
};

export const dataProvider = (
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
