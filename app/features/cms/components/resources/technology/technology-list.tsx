import { Datagrid, List, TextField } from 'react-admin';

export const TechnologyList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="name" />
            <TextField source="icons" />
        </Datagrid>
    </List>
);
