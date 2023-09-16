import {
    AutocompleteArrayInput,
    Create,
    ReferenceArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" />
            <TextInput source="username" validate={[required()]} />
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
