import { DateField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const QualificationShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="grade" />
            <TextField source="institution" />
            <DateField source="date" />
        </SimpleShowLayout>
    </Show>
);
