import {
    Edit,
    ImageField,
    ImageInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const NoteImageEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="altText" />
            <TextInput source="contentType" disabled />
            <ImageInput source="src">
                <ImageField source="src" />
            </ImageInput>
            <ReferenceInput source="noteId" reference="Note" />
        </SimpleForm>
    </Edit>
);
