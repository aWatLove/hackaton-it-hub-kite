import { FC, ReactNode } from 'react';
import { createContext as createReactContext, useContextSelector } from 'use-context-selector';

type ObjectType = Record<string | number | symbol, any>;

type IProvider<Options extends ObjectType> = {
    children: ReactNode;
} & Options;
//@ts-ignore
const createContext = <ContextType extends object, Options extends ObjectType>(createStore: (options: Options) => ContextType, defaultSelector = (v) => v) => {
    const Context = createReactContext<ContextType>({} as ContextType);

    const Provider: FC<IProvider<Options>> = ({ children, ...options }) => {
        const store = createStore(options as unknown as Options); // todo: правильный тип для IProvider, сейчас не совсем корректный

        // @ts-ignore
        return <Context.Provider value={store}>{children}</Context.Provider>;
    };

    const useStore = <Selected extends any = ContextType>(selector: (value: ContextType) => Selected = defaultSelector): Selected =>
        useContextSelector<ContextType, Selected>(Context, selector);

    return {
        useStore,
        Provider,
        Context,
    };
};

// default Selector doesn't work correctly

export { createContext };
