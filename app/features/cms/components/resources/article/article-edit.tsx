import CodeBlockLowLight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { DefaultEditorOptions, RichTextInput } from 'ra-input-rich-text';
import {
    BooleanInput,
    Edit,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    required,
} from 'react-admin';

const lowlight = createLowlight(common);

export const ArticleEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="title" validate={[required()]} />
            <TextInput source="slug" />
            <TextInput source="description" />
            <TextInput source="tags" />
            <BooleanInput source="draft" label="Draft" />
            <RichTextInput
                source="content"
                className="rich-text"
                editorOptions={{
                    ...DefaultEditorOptions,
                    extensions: [
                        ...(DefaultEditorOptions.extensions ?? []),
                        CodeBlockLowLight.configure({
                            lowlight,
                        }),
                    ],
                }}
            />
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
    </Edit>
);
