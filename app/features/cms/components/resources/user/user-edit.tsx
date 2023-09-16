import {
    AutocompleteArrayInput,
    Edit,
    PasswordInput,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const UserEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="email" />
            <TextInput source="username" validate={[required()]} />
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
