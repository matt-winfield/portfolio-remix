import { type TypePolicies } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export const typePolicies: TypePolicies = {
    Viewer: {
        fields: {
            articlesConnection: relayStylePagination(),
        },
    },
};
