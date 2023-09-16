import { Edit, SimpleForm, TextInput, required } from 'react-admin';

export const TechnologyEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" validate={[required()]} />
        </SimpleForm>
    </Edit>
);
