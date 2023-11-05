import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'app/graphql/schema.graphql',
    documents: ['app/**/*.{ts,tsx}'],
    emitLegacyCommonJSImports: false,
    generates: {
        './app/graphql/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            },
        },
    },
    ignoreNoDocuments: true,
};

export default config;
