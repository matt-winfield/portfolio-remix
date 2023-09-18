import { Datagrid, DateField, List, TextField } from 'react-admin';

export const ExperienceList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="title" />
            <TextField source="company" />
            <DateField source="startDate" />
            <DateField source="endDate" />
        </Datagrid>
    </List>
);
