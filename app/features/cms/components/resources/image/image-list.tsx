import { Datagrid, ImageField, List, TextField } from 'react-admin';

export const ImageList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="altText" />
            <TextField source="contentType" />
            <ImageField source="src" />
        </Datagrid>
    </List>
);
