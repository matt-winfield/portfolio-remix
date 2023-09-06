import {
    AutocompleteArrayInput,
    Edit,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="email" />
            <TextInput source="username" />
            <TextInput source="name" />
            <ReferenceArrayInput
                label="Roles"
                reference="role"
                source="roleIds"
            >
                <AutocompleteArrayInput optionText={'name'} />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);
