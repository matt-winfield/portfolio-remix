import {
    ChipField,
    Datagrid,
    EmailField,
    List,
    ReferenceArrayField,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <EmailField source="email" />
            <TextField source="username" />
            <TextField source="name" />
            <ReferenceArrayField
                label="Roles"
                reference="role"
                source="roleIds"
            >
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);
