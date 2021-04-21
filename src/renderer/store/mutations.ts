/**
 * 全局Mutation
 */
import { MutationTree, Mutation } from 'vuex'
import { State } from '@/store/index'
import * as types from '@/store/mutation-types'

// 修改标题
const updateTitle: Mutation<State> = (state: State, payload: string) => {
  state.title = payload
}

// 更新窗口最大化状态
const updateMaximized: Mutation<State> = (state: State, payload: boolean) => {
  state.isMaximized = payload
}

// 更新窗口获焦状态
const updateWindowFocus: Mutation<State> = (state: State, payload: boolean) => {
  state.isWindowFocus = payload
}

// 导出 MutationTree
const mutationTree: MutationTree<State> = {
  [types.UPDATE_TITLE]:updateTitle,
  [types.UPDATE_MAXIMIZED]:updateMaximized,
  [types.UPDATE_WINFOCUS]:updateWindowFocus
}

export default mutationTree
