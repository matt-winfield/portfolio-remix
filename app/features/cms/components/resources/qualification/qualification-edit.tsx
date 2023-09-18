import { DateInput, Edit, SimpleForm, TextInput, required } from 'react-admin';

export const QualificationEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" validate={[required()]} />
            <TextInput source="grade" validate={[required()]} />
            <TextInput source="institution" validate={[required()]} />
            <DateInput source="date" validate={[required()]} />
        </SimpleForm>
    </Edit>
);
