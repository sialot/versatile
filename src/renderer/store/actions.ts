/**
 * 全局actions
 */
import { Commit, Action, ActionTree } from 'vuex'
import * as types from '@/store/mutation-types'
import { State } from '@/store/index'

// 更新页面标题
const updateTitle: Action<State, any> = (context: { commit: Commit }, title: string) => {
    context.commit(types.UPDATE_TITLE, title)
}

// 定义ActionTree
const actions: ActionTree<State, any> = {
    updateTitle,
}

export default actions
