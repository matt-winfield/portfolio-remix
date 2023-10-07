import { RichTextInput } from 'ra-input-rich-text';
import {
    BooleanInput,
    Create,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

export const ArticleCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <TextInput source="slug" />
            <BooleanInput source="draft" label="Draft" />
            <TextInput source="description" />
            <TextInput source="tags" />
            <RichTextInput source="content" className="rich-text" />
            <ReferenceArrayInput
                label="Images"
                reference="image"
                source="imageIds"
            >
                <SelectArrayInput
                    optionText={(record) => (
                        <img
                            src={record.src}
                            alt={record.altText}
                            style={{ width: '100px' }}
                        />
                    )}
                />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);
