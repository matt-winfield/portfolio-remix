import { ImageField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const ImageShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="altText" />
            <TextField source="contentType" />
            <ImageField source="src" />
        </SimpleShowLayout>
    </Show>
);
