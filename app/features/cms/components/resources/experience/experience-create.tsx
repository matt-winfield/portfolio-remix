import {
    Create,
    DateInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const ExperienceCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <TextInput source="company" validate={[required()]} />
            <DateInput source="startDate" validate={[required()]} />
            <DateInput source="endDate" />
        </SimpleForm>
    </Create>
);
