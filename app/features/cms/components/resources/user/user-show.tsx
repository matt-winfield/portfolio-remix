import {
    ArrayField,
    Datagrid,
    EmailField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField,
} from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <EmailField source="email" />
            <TextField source="username" />
            <TextField source="name" />
            <TextField source="createdAt" />
            <TextField source="updatedAt" />
            <ArrayField source="roles">
                <Datagrid>
                    <ReferenceField reference="Role" source="id">
                        <TextField source="name" />
                    </ReferenceField>
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);
