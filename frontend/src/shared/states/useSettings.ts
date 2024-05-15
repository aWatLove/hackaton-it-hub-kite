import { useRQValue } from '@/shared/lib/query/useRQValue';

export const useSettings = () => useRQValue({ key: 'settingsOpen', defaultValue: false });
