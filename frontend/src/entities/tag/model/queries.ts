import { useQuery } from '@tanstack/react-query';
import { TagRepo } from '@/entities/tag/model/repo';
import { TagsKeys } from '@/entities/tag/model/keys';

export const useTagsQuery = () => useQuery({ queryFn: () => TagRepo.getAllTags(), queryKey: TagsKeys.getAllTags(), staleTime: Infinity });
