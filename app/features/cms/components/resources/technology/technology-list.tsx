import { List, TextField } from 'react-admin';
import { ReorderableDataGrid } from '../../reorderable-datagrid/reorderable-datagrid.tsx';

export const TechnologyList = () => (
    <List>
        <ReorderableDataGrid rowClick="show">
            <TextField source="name" />
            <TextField source="icons" />
        </ReorderableDataGrid>
    </List>
);
