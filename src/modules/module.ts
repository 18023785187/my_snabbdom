import {
  PreHook,
  CreateHook,
  UpdateHook,
  DestroyHook,
  RemoveHook,
  PostHook,
} from '../hooks'

/**
 * init函数中使用的 hooks
 */
export type Module = Partial<{ // Partial 泛型：使泛型中的所有属性都是可选的 相当于 key?: val
  pre: PreHook,
  create: CreateHook,
  update: UpdateHook,
  destroy: DestroyHook,
  remove: RemoveHook,
  post: PostHook
}>

// END
