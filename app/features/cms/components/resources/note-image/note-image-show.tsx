import {
    ImageField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField,
} from 'react-admin';

export const NoteImageShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="altText" />
            <TextField source="contentType" />
            <ImageField source="src" />
            <ReferenceField source="noteId" reference="Note" />
        </SimpleShowLayout>
    </Show>
);
