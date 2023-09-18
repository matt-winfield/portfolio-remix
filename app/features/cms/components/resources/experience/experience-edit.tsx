import { DateInput, Edit, SimpleForm, TextInput, required } from 'react-admin';

export const ExperienceEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <TextInput source="company" validate={[required()]} />
            <DateInput source="startDate" validate={[required()]} />
            <DateInput source="endDate" />
        </SimpleForm>
    </Edit>
);
