import { useOptionalUser } from '#app/utils/user.ts';
import {
    Admin,
    EditGuesser,
    Resource,
    ShowGuesser,
    defaultDarkTheme,
    defaultTheme,
} from 'react-admin';
import { authProvider } from '../providers/auth-provider.tsx';
import { dataProvider } from '../providers/data-provider.tsx';
import { NoteImageCreate } from './resources/note-image/note-image-create.tsx';
import { NoteImageEdit } from './resources/note-image/note-image-edit.tsx';
import { NoteImageList } from './resources/note-image/note-image-list.tsx';
import { NoteImageShow } from './resources/note-image/note-image-show.tsx';
import { NoteEdit } from './resources/note/note-edit.tsx';
import { NoteList } from './resources/note/note-list.tsx';
import { NoteShow } from './resources/note/note-show.tsx';
import { PermissionList } from './resources/permission/permission-list.tsx';
import { ProjectCreate } from './resources/project/project-create.tsx';
import { ProjectEdit } from './resources/project/project-edit.tsx';
import { ProjectList } from './resources/project/project-list.tsx';
import { ProjectShow } from './resources/project/project-show.tsx';
import { RoleList } from './resources/role/role-list.tsx';
import { UserCreate } from './resources/user/user-create.tsx';
import { UserEdit } from './resources/user/user-edit.tsx';
import { UserList } from './resources/user/user-list.tsx';
import { UserShow } from './resources/user/user-show.tsx';

const lightTheme = {
    ...defaultTheme,
    components: {
        ...defaultTheme.components,
        MuiChip: {
            styleOverrides: {
                root: {
                    height: 'fit-content',
                },
            },
        },
    },
};

const darkTheme = {
    ...defaultDarkTheme,
    components: {
        ...defaultDarkTheme.components,
        MuiChip: {
            styleOverrides: {
                root: {
                    height: 'fit-content',
                },
            },
        },
    },
};

const App = () => {
    const user = useOptionalUser();

    return (
        <Admin
            basename="/admin/cms"
            dataProvider={dataProvider('/api')}
            authProvider={authProvider(user)}
            theme={lightTheme}
            darkTheme={darkTheme}
        >
            <Resource
                name="User"
                list={UserList}
                show={UserShow}
                edit={UserEdit}
                create={UserCreate}
                recordRepresentation={(user) => user.username ?? user.email}
            />
            <Resource
                name="Project"
                list={ProjectList}
                show={ProjectShow}
                edit={ProjectEdit}
                create={ProjectCreate}
                recordRepresentation="name"
            />
            <Resource
                name="Note"
                list={NoteList}
                show={NoteShow}
                edit={NoteEdit}
                recordRepresentation="title"
            />
            <Resource
                name="Role"
                list={RoleList}
                show={ShowGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="Permission"
                list={PermissionList}
                show={ShowGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="NoteImage"
                list={NoteImageList}
                show={NoteImageShow}
                edit={NoteImageEdit}
                create={NoteImageCreate}
            />
        </Admin>
    );
};

export default App;
