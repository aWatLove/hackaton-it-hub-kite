import { useQuery } from '@tanstack/react-query';
import { TeamKeys } from '@/entities/team/model/keys';
import { useParams } from 'next/navigation';
import { TeamDetail } from '@/shared/models/team.model';
import { $api } from '@/shared/lib/axios/instance';

const mockTeamListId100 = {
    id: 100,
    avatar: 'http://localhost:3001/avatars/rock',
    folowers_count: 5,
    isFolow: true,
    members: [],
    name: 'ithub_team',
    owner_id: 100,
    projects: [],
} satisfies TeamDetail;
const mockTeamListId101 = {
    id: 101,
    avatar: 'http://localhost:3001/avatars/user-[1].pn',
    folowers_count: 10,
    isFolow: false,
    members: [],
    name: 'lololaodads_team',
    owner_id: 101,
    projects: [
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description: 'dsds',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Я манал этот СиЭсес',
        },
    ],
} satisfies TeamDetail;
const mockTeamListId102 = {
    id: 102,
    avatar: 'http://localhost:3001/avatars/rock.jpg',
    folowers_count: 5,
    isFolow: false,
    descriptions:
        '<div>' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed aliquet magna, vel condimentum felis. Praesent justo mi, suscipit non egestas consequat, hendrerit ac orci. Cras finibus quam ac lacus interdum aliquet. Integer bibendum eros eget vulputate luctus. Vivamus at arcu mi. Praesent sollicitudin nunc eu vulputate auctor. Nullam dictum mi ut nulla tristique tempus. Fusce vulputate sollicitudin maximus. Ut feugiat, augue et suscipit gravida, lectus orci sagittis libero, ac maximus neque sapien eget libero. Praesent finibus dolor sem, ut accumsan lectus malesuada eget. Proin vulputate velit in ex hendrerit vestibulum at eu sapien. Curabitur ac laoreet nisl. In sed tincidunt ex, eget tincidunt nisi. Donec ac massa volutpat, blandit est eget, convallis dolor.\n' +
        '\n' +
        'Curabitur ullamcorper vestibulum enim, eget eleifend tellus auctor et. Suspendisse sed ligula vel ipsum pharetra dictum quis sed dui. Nam in velit mollis, interdum nisl vitae, efficitur lorem. Cras et egestas urna, vitae tincidunt lorem. Suspendisse potenti. Nullam non sem finibus, varius elit sit amet, volutpat ipsum. Integer egestas enim ipsum, sagittis vulputate tortor cursus non' +
        '</div>',
    members: [
        { id: 4, avatar: 'http://localhost:3001/avatars/user-[1].png', role: 'БЭК', username: 'ds' },
        { id: 4, avatar: 'http://localhost:3001/avatars/user-[1].pn', role: 'Властитель', username: 'ds' },
    ],
    name: 'sjkfdsjkdjkfdjkdsfjlksfdj',
    owner_id: 101,
    projects: [
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description: 'dsds',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Ф аыа Я аобао ваы аы',
        },
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description: 'dsds',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Ф аыа Я аобао ваы аы',
        },
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description: 'dsds',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Ф аыа Я аобао ваы аы',
        },
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description: 'dsds',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Ф аыа Я аобао ваы аы',
        },
        {
            id: 1,
            created_at: '2014-03-11T13:37:27+00:00',
            description:
                '<div>' +
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed aliquet magna, vel condimentum felis. Praesent justo mi, suscipit non egestas consequat, hendrerit ac orci. Cras finibus quam ac lacus interdum aliquet. Integer bibendum eros eget vulputate luctus. Vivamus at arcu mi. Praesent sollicitudin nunc eu vulputate auctor. Nullam dictum mi ut nulla tristique tempus. Fusce vulputate sollicitudin maximus. Ut feugiat, augue et suscipit gravida, lectus orci sagittis libero, ac maximus neque sapien eget libero. Praesent finibus dolor sem, ut accumsan lectus malesuada eget. Proin vulputate velit in ex hendrerit vestibulum at eu sapien. Curabitur ac laoreet nisl. In sed tincidunt ex, eget tincidunt nisi. Donec ac massa volutpat, blandit est eget, convallis dolor.\n' +
                '\n' +
                'Curabitur ullamcorper vestibulum enim, eget eleifend tellus auctor et. Suspendisse sed ligula vel ipsum pharetra dictum quis sed dui. Nam in velit mollis, interdum nisl vitae, efficitur lorem. Cras et egestas urna, vitae tincidunt lorem. Suspendisse potenti. Nullam non sem finibus, varius elit sit amet, volutpat ipsum. Integer egestas enim ipsum, sagittis vulputate tortor cursus non' +
                '</div>',
            folowers_count: 5,
            likes_count: 5,
            patch_count: 3,
            title: 'Как мы делали микросервисы для мексиканского притона, торгующего детскими детьми с лейкимией',
        },
    ],
} satisfies TeamDetail;
export const useTeamById = (id: number | undefined) => {
    return useQuery({
        queryFn: () => $api.get<TeamDetail>(`api/team/${id}`).then((v) => v.data),
        queryKey: TeamKeys.getTeamById(id),
        enabled: !!id || id === 0,
    });
};
export const useTeamCurrentQuery = () => {
    //@ts-ignore
    const { id } = useParams<{ id: number }>();
    return useTeamById(id);
};
