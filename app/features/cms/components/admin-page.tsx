import { Admin, EditGuesser, Resource, ShowGuesser } from 'react-admin';
import { dataProvider } from '../providers/data-provider.tsx';
import { NoteImageEdit } from './resources/note-image/note-image-edit.tsx';
import { NoteImageList } from './resources/note-image/note-image-list.tsx';
import { NoteImageShow } from './resources/note-image/note-image-show.tsx';
import { NoteList } from './resources/note/note-list.tsx';
import { PermissionList } from './resources/permission/permission-list.tsx';
import { RoleList } from './resources/role/role-list.tsx';
import { UserEdit } from './resources/user/user-edit.tsx';
import { UserList } from './resources/user/user-list.tsx';
import { UserShow } from './resources/user/user-show.tsx';

const App = () => (
    <Admin basename="/admin/cms" dataProvider={dataProvider('/api')}>
        <Resource
            name="User"
            list={UserList}
            show={UserShow}
            edit={UserEdit}
            recordRepresentation="username"
        />
        <Resource
            name="Note"
            list={NoteList}
            show={ShowGuesser}
            edit={EditGuesser}
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
        />
    </Admin>
);

export default App;
