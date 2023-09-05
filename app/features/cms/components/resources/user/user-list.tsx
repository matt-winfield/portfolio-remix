import {
    ArrayField,
    Datagrid,
    EmailField,
    List,
    ReferenceField,
    TextField,
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <EmailField source="email" />
            <TextField source="username" />
            <TextField source="name" />
            <ArrayField source="roles">
                <Datagrid>
                    <ReferenceField reference="Role" source="id">
                        <TextField source="name" />
                    </ReferenceField>
                </Datagrid>
            </ArrayField>
        </Datagrid>
    </List>
);
