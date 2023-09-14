import { resetUserPassword } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { PasswordSchema } from '#app/utils/user-validation.ts';
import {
    createHandler,
    defaultHandler,
    getListHandler,
    getOneHandler,
    updateHandler,
    type RaPayload,
} from 'ra-data-simple-prisma';

export const userHandler = async (body: RaPayload) => {
    switch (body.method) {
        case 'create': {
            return await createHandler(body, prisma.user, {
                connect: {
                    roleIds: {
                        roles: 'id',
                    },
                },
            });
        }
        case 'getList': {
            return await getListHandler(body, prisma.user, {
                include: {
                    roles: true,
                },
                map: (users) =>
                    users.map((user: any) => ({
                        ...user,
                        roleIds: user.roles?.map((role: any) => role.id),
                    })),
            });
        }
        case 'getOne': {
            return await getOneHandler(body, prisma.user, {
                include: {
                    roles: true,
                },
                transform: (user) => {
                    user.roleIds = user.roles?.map((role: any) => role.id);
                },
            });
        }
        case 'update': {
            const username = body.params.data.username as string | undefined;
            const password = body.params.data.password as string | undefined;
            if (username && password && password.trim().length > 0) {
                const validationResult = PasswordSchema.safeParse(password);
                if (validationResult.success) {
                    await resetUserPassword({ username, password });
                }
                delete body.params.data.password;
            }

            return await updateHandler(body, prisma.user, {
                set: {
                    roleIds: {
                        roles: 'id',
                    },
                },
            });
        }
        default:
            return await defaultHandler(body, prisma);
    }
};
