/**
 * 全局Mutation
 */
import { MutationTree, Mutation } from 'vuex'
import { State } from '@/store/index'
import * as types from '@/store/mutation-types'
import {UIPannel} from '@/core/pannel/PannelManager'

/**=======================================================
 * 浏览器窗口
 *=======================================================*/
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

/**=======================================================
 * 面板
 *=======================================================*/

// 添加面板
const addUIPannel: Mutation<State> = (state: State, payload: UIPannel) => {
  if(!payload.ID){
    return false
  }
  state.pannelList.push(payload);
  return true
}


// 导出 MutationTree
const mutationTree: MutationTree<State> = {
  [types.UPDATE_TITLE]:updateTitle,
  [types.UPDATE_MAXIMIZED]:updateMaximized,
  [types.UPDATE_WINFOCUS]:updateWindowFocus,
  [types.ADD_UI_PANNEL]:addUIPannel
}

export default mutationTree