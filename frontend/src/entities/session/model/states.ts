import { useRQValue } from '@/shared/lib/query/useRQValue';

export const useAuthModal = () => useRQValue({ key: 'authModal', defaultValue: false });
