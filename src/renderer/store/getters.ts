/**
 * 全局Getter
 */
import { GetterTree, Getter } from 'vuex'
import { State } from '@/store/index'

// 全局state获取
const globalState:  Getter<State, any> = (state: State) => {
  return state
}

// 获取页面标题
const title: Getter<State, any> = (state: State) => {
  return state.title
}

// 获取是否最大化
const isMaximized: Getter<State, any> = (state: State) => {
  return state.isMaximized
}

// 获取窗口是否获焦
const isWindowFocus: Getter<State, any> = (state: State) => {
  return state.isWindowFocus
}

// 定义GetterTree
const getterTree: GetterTree<State, any> = {
  globalState,
  title,
  isWindowFocus,
  isMaximized
}

export default getterTree
