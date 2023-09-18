import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const TechnologyCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="icons" />
        </SimpleForm>
    </Create>
);
