import { Show, SimpleShowLayout, TextField } from 'react-admin';

export const TechnologyShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="icons" />
        </SimpleShowLayout>
    </Show>
);
