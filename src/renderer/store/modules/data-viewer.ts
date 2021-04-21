import { Commit } from 'vuex'
import * as types from '@/store/mutation-types'

// 菜单数据定义
export interface State {
    title:string
}

// 初始化数据
const initState: State = {
    title : 'State Viewer'
}


// getters
const getters = {
    title: (state: State) => state.title,
}
  
// actions
const actions = {

}
  
// mutations
const mutations = {

}
  
export default {
    state: initState,
    getters,
    actions,
    mutations,
}
