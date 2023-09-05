import { Datagrid, DateField, List, TextField } from 'react-admin';

export const RoleList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="name" />
            <DateField source="description" />
        </Datagrid>
    </List>
);
