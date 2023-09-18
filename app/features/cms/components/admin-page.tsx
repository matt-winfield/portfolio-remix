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
import { ExperienceCreate } from './resources/experience/experience-create.tsx';
import { ExperienceEdit } from './resources/experience/experience-edit.tsx';
import { ExperienceList } from './resources/experience/experience-list.tsx';
import { ExperienceShow } from './resources/experience/experience-show.tsx';
import { ImageCreate } from './resources/image/image-create.tsx';
import { ImageEdit } from './resources/image/image-edit.tsx';
import { ImageList } from './resources/image/image-list.tsx';
import { ImageShow } from './resources/image/image-show.tsx';
import { PermissionList } from './resources/permission/permission-list.tsx';
import { ProjectCreate } from './resources/project/project-create.tsx';
import { ProjectEdit } from './resources/project/project-edit.tsx';
import { ProjectList } from './resources/project/project-list.tsx';
import { ProjectShow } from './resources/project/project-show.tsx';
import { QualificationCreate } from './resources/qualification/qualification-create.tsx';
import { QualificationEdit } from './resources/qualification/qualification-edit.tsx';
import { QualificationList } from './resources/qualification/qualification-list.tsx';
import { QualificationShow } from './resources/qualification/qualification-show.tsx';
import { RoleList } from './resources/role/role-list.tsx';
import { TechnologyCreate } from './resources/technology/technology-create.tsx';
import { TechnologyEdit } from './resources/technology/technology-edit.tsx';
import { TechnologyList } from './resources/technology/technology-list.tsx';
import { TechnologyShow } from './resources/technology/technology-show.tsx';
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
                name="Image"
                list={ImageList}
                show={ImageShow}
                edit={ImageEdit}
                create={ImageCreate}
            />
            <Resource
                name="Technology"
                list={TechnologyList}
                edit={TechnologyEdit}
                show={TechnologyShow}
                create={TechnologyCreate}
                recordRepresentation="name"
            />
            <Resource
                name="Experience"
                list={ExperienceList}
                edit={ExperienceEdit}
                show={ExperienceShow}
                create={ExperienceCreate}
                recordRepresentation="title"
            />
            <Resource
                name="Qualification"
                list={QualificationList}
                edit={QualificationEdit}
                show={QualificationShow}
                create={QualificationCreate}
                recordRepresentation="title"
            />
            {/* <Resource
                name="Note"
                list={NoteList}
                show={NoteShow}
                edit={NoteEdit}
                recordRepresentation="title"
            /> */}
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
            {/* <Resource
                name="NoteImage"
                list={NoteImageList}
                show={NoteImageShow}
                edit={NoteImageEdit}
                create={NoteImageCreate}
            /> */}
        </Admin>
    );
};

export default App;
