import {
    ArrayField,
    Datagrid,
    ImageField,
    List,
    ReferenceField,
    TextField,
} from 'react-admin';

export const NoteList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="title" />
            <TextField source="content" />
            <ReferenceField source="ownerId" reference="User" link="show" />
            <ArrayField source="images">
                <Datagrid>
                    <ImageField source="src" />
                </Datagrid>
            </ArrayField>
        </Datagrid>
    </List>
);
