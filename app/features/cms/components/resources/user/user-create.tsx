import {
    AutocompleteArrayInput,
    Create,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

export const UserCreate = () => (
    <Create>
        <SimpleForm>
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
    </Create>
);
