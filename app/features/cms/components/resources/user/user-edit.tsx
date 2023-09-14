import {
    AutocompleteArrayInput,
    Edit,
    PasswordInput,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const UserEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="email" />
            <TextInput source="username" />
            <TextInput source="name" />
            <PasswordInput source="password" />
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
