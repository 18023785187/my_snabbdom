import { PreHook, CreateHook, UpdateHook, DestroyHook, RemoveHook, PostHook } from '../hooks';
/**
 * init函数中使用的 hooks
 */
export declare type Module = Partial<{
    pre: PreHook;
    create: CreateHook;
    update: UpdateHook;
    destroy: DestroyHook;
    remove: RemoveHook;
    post: PostHook;
}>;
