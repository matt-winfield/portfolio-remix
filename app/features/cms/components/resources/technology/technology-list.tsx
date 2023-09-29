import { List, TextField } from 'react-admin';
import { ReorderableDataGrid } from '../../reorderable-datagrid/reorderable-datagrid.tsx';

export const TechnologyList = () => (
    <List pagination={false}>
        <ReorderableDataGrid rowClick="show">
            <TextField source="name" sortable={false} />
            <TextField source="icons" sortable={false} />
        </ReorderableDataGrid>
    </List>
);
