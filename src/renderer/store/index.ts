import Vue from 'vue'
import Vuex, { Commit, Dispatch } from 'vuex'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import dataViewer from '@/store/modules/data-viewer'
import {UIPannel, pannelManager} from '@/core/pannel/PannelManager'

Vue.use(Vuex)

// 全局数据存储结构定义
export interface State {

  // 窗口标题
  title:string,

  // 是否最大化
  isMaximized:boolean,

  // 是否为当前激活窗口
  isWindowFocus:boolean

  // 面板数据存储
  pannelList:UIPannel[]
}

// state 数据初始化
const initState: State = {
  title: 'Versatile',
  isMaximized: false,
  isWindowFocus: true,
  pannelList:pannelManager.loadPannels()
}

export default new Vuex.Store({
  state: initState,
  actions,
  getters,
  mutations,
  modules : {
    dataViewer
  }
})