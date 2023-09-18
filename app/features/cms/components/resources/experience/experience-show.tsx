import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const ExperienceShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="company" />
            <DateField source="startDate" />
            <DateField source="endDate" />
        </SimpleShowLayout>
    </Show>
);
