import {
    Create,
    DateInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const QualificationCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <TextInput source="grade" validate={[required()]} />
            <TextInput source="institution" validate={[required()]} />
            <DateInput source="date" validate={[required()]} />
        </SimpleForm>
    </Create>
);
