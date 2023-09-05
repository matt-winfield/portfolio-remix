import { Datagrid, DateField, List, TextField } from 'react-admin';

export const PermissionList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="action" />
            <TextField source="entity" />
            <TextField source="access" />
            <DateField source="description" />
        </Datagrid>
    </List>
);
