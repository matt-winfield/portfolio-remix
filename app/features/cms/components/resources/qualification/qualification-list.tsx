import { Datagrid, DateField, List, TextField } from 'react-admin';

export const QualificationList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="title" />
            <TextField source="grade" />
            <TextField source="institution" />
            <DateField source="date" />
        </Datagrid>
    </List>
);
