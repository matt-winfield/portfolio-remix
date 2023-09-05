import { Datagrid, EmailField, List, TextField } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <EmailField source="email" />
            <TextField source="username" />
            <TextField source="name" />
        </Datagrid>
    </List>
);
