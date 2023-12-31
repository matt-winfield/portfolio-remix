import {
    Datagrid,
    ImageField,
    List,
    ReferenceArrayField,
    ReferenceField,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const NoteList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="title" />
            <TextField source="content" />
            <ReferenceField source="ownerId" reference="User" link="show" />
            <ReferenceArrayField
                label="Images"
                reference="noteImage"
                source="imageIds"
            >
                <SingleFieldList>
                    <ImageField source="src" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
