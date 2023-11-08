import {
    ApolloLink,
    Observable,
    type Operation,
    type FetchResult,
} from '@apollo/client';

import { type GraphQLSchema, validate, execute } from 'graphql';

// Copied from the apollo-client source code:
// https://github.com/apollographql/apollo-client/blob/291aea56bfaed3987a98be7fe4e6160114b62d2d/src/link/schema/index.ts#L38
// We get issues with duplicate instances of graphql when we use the apollo-client implementation. (Possibly a pnpm issue?)
export namespace SchemaLink {
    export type ResolverContext = Record<string, any>;
    export type ResolverContextFunction = (
        operation: Operation,
    ) => ResolverContext | PromiseLike<ResolverContext>;

    export interface Options {
        /**
         * The schema to generate responses from.
         */
        schema: GraphQLSchema;

        /**
         * The root value to use when generating responses.
         */
        rootValue?: any;

        /**
         * A context to provide to resolvers declared within the schema.
         */
        context?: ResolverContext | ResolverContextFunction;

        /**
         * Validate incoming queries against the given schema, returning
         * validation errors as a GraphQL server would.
         */
        validate?: boolean;
    }
}

export class SchemaLink extends ApolloLink {
    public schema: SchemaLink.Options['schema'];
    public rootValue: SchemaLink.Options['rootValue'];
    public context: SchemaLink.Options['context'];
    public validate: boolean;

    constructor(options: SchemaLink.Options) {
        super();
        this.schema = options.schema;
        this.rootValue = options.rootValue;
        this.context = options.context;
        this.validate = !!options.validate;
    }

    public request(operation: Operation): Observable<FetchResult> {
        return new Observable<FetchResult>((observer) => {
            new Promise<SchemaLink.ResolverContext>((resolve) =>
                resolve(
                    typeof this.context === 'function'
                        ? this.context(operation)
                        : this.context,
                ),
            )
                .then((context) => {
                    if (this.validate) {
                        const validationErrors = validate(
                            this.schema,
                            operation.query,
                        );
                        if (validationErrors.length > 0) {
                            return { errors: validationErrors };
                        }
                    }

                    return execute({
                        schema: this.schema,
                        document: operation.query,
                        rootValue: this.rootValue,
                        contextValue: context,
                        variableValues: operation.variables,
                        operationName: operation.operationName,
                    });
                })
                .then((data) => {
                    if (!observer.closed) {
                        observer.next(data);
                        observer.complete();
                    }
                })
                .catch((error) => {
                    if (!observer.closed) {
                        observer.error(error);
                    }
                });
        });
    }
}
