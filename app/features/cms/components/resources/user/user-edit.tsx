import {
    ArrayInput,
    Edit,
    ReferenceInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
} from 'react-admin';

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="email" />
            <TextInput source="username" />
            <TextInput source="name" />
            <ArrayInput source="roles">
                <SimpleFormIterator>
                    <ReferenceInput reference="Role" source="id" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);
