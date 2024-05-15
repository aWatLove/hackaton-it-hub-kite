import { $api } from '@/shared/lib/axios/instance';
import { TagsList } from '@/shared/models/tags.model';

export class TagRepo {
    public static getAllTags = () => $api.get<TagsList>('api/tag').then((v) => v.data) as Promise<TagsList>;
}
