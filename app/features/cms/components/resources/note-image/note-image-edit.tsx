import {
    Edit,
    ImageField,
    ImageInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const NoteimageEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="altText" />
            <TextInput source="contentType" />
            <ImageInput source="src">
                <ImageField source="src" />
            </ImageInput>
            <ReferenceInput source="noteId" reference="Note" />
        </SimpleForm>
    </Edit>
);
