import {
    Create,
    ImageField,
    ImageInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const ImageCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="altText" />
            <ImageInput source="src">
                <ImageField source="src" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
