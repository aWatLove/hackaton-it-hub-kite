import dynamic from 'next/dynamic';

const SelectDynamic = dynamic(() => import('./select'), { ssr: false }) as any;

export default SelectDynamic;
export type { SelectProps } from './select';
