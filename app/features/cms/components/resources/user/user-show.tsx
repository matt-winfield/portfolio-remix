import {
    ChipField,
    EmailField,
    ReferenceArrayField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
} from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
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
        </SimpleShowLayout>
    </Show>
);
