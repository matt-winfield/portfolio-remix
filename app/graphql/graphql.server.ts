import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';
import { prisma } from '#app/utils/db.server.ts';

const PageInfoType = new GraphQLObjectType({
    name: 'PageInfo',
    fields: {
        startCursor: { type: GraphQLString },
        endCursor: { type: GraphQLString },
        hasNextPage: { type: GraphQLBoolean },
        hasPreviousPage: { type: GraphQLBoolean },
    },
});

const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: {
        id: { type: GraphQLID },
        altText: { type: GraphQLString },
        contentType: { type: GraphQLString },
    },
});

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        description: { type: GraphQLString },
        tags: { type: GraphQLString },
        images: { type: new GraphQLList(ImageType) },
        publishedAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        slug: { type: GraphQLString },
        draft: { type: GraphQLBoolean },
    },
});

const ArticleEdgeType = new GraphQLObjectType({
    name: 'ArticleEdge',
    fields: {
        cursor: { type: GraphQLString },
        node: { type: ArticleType },
    },
});

const ArticlesConnectionType = new GraphQLObjectType({
    name: 'ArticleConnection',
    fields: {
        edges: { type: new GraphQLList(ArticleEdgeType) },
        pageInfo: { type: PageInfoType },
    },
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        image: { type: ImageType },
    },
});

const ViewerType = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
        user: {
            type: UserType,
            resolve: async (source, args, context) => {
                if (!context.user) {
                    return null;
                }

                const result = await prisma.user.findUnique({
                    where: {
                        id: context.user?.id,
                    },
                });

                return serializable(result);
            },
        },
        articlesConnection: {
            type: ArticlesConnectionType,
            args: {
                after: { type: GraphQLString },
                limit: { type: GraphQLInt },
            },
            resolve: async (source, args, context) => {
                const after = args.after as string | undefined;
                const limit = args.limit as number;

                const user = context.user
                    ? await prisma.user.findUnique({
                          where: {
                              id: context.user?.id,
                          },
                          select: {
                              roles: {
                                  select: {
                                      name: true,
                                  },
                              },
                          },
                      })
                    : undefined;

                const showDrafts =
                    user?.roles?.some((role) => role.name == 'admin') ?? false;

                const articlesPlusOne = await prisma.article.findMany({
                    take: limit + 1, // take one more than we need to see if there is a next page
                    cursor: after ? { id: after } : undefined,
                    skip: after ? 1 : undefined,
                    where: {
                        draft: showDrafts ? undefined : false,
                    },
                });

                const articles = articlesPlusOne.slice(0, limit);

                const result = {
                    edges: articles.map((article) => ({
                        cursor: article.id,
                        node: article,
                    })),
                    pageInfo: {
                        startCursor: articles[0].id,
                        endCursor: articles[articles.length - 1].id,
                        hasNextPage: articlesPlusOne.length > limit,
                        hasPreviousPage: after !== undefined,
                    },
                };

                return serializable(result);
            },
        },
        article: {
            type: ArticleType,
            args: {
                id: { type: GraphQLID },
            },
            resolve: async (source, args, context) => {
                const result = await prisma.article.findUnique({
                    where: {
                        id: args.id,
                    },
                });

                return serializable(result);
            },
        },
    },
});

export const graphqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            viewer: {
                type: ViewerType,
                resolve: () => ({}),
            },
            image: {
                type: ImageType,
                args: {
                    id: { type: GraphQLID },
                },
                resolve: async (source, args, context) => {
                    const result = await prisma.image.findUnique({
                        where: {
                            id: args.id,
                        },
                    });

                    return serializable(result);
                },
            },
        },
    }),
});

const serializable = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
};
