import {
    Create,
    ImageField,
    ImageInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const NoteImageCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="altText" />
            <ImageInput source="src">
                <ImageField source="src" />
            </ImageInput>
            <ReferenceInput source="noteId" reference="Note" />
        </SimpleForm>
    </Create>
);
