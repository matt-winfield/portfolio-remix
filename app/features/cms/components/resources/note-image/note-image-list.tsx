import {
    Datagrid,
    ImageField,
    List,
    ReferenceField,
    TextField,
} from 'react-admin';

export const NoteImageList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="altText" />
            <TextField source="contentType" />
            <ImageField source="src" />
            <ReferenceField source="noteId" reference="Note" link="show" />
        </Datagrid>
    </List>
);
