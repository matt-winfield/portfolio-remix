import {
    Edit,
    ImageField,
    ImageInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const ImageEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="altText" />
            <TextInput source="contentType" disabled />
            <ImageInput source="src">
                <ImageField source="src" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);
