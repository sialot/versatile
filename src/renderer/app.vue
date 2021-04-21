<template>
  <div id="main">
    <title-bar></title-bar>
    <router-view></router-view> 
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import titleBar from '@/components/ui/title-bar.vue'
import {CommonAPI, browserWindow} from "@/public/CommonAPI"
import { Mutation } from 'vuex-class';
import * as types from '@/store/mutation-types'

@Component({
  components:{titleBar}
})
export default class App extends Vue{

  @Mutation(types.UPDATE_MAXIMIZED) updateMaximized!:any;
  @Mutation(types.UPDATE_WINFOCUS) updateWindowFocus!:any;

  // 组件创建后
  created () {

      // 接收窗口事件
      browserWindow.on(CommonAPI.WIN_EVENT.maximize, () => {
        this.updateMaximized(true)
      })

      browserWindow.on(CommonAPI.WIN_EVENT.unmaximize, () => {
        this.updateMaximized(false)
      })

      browserWindow.on(CommonAPI.WIN_EVENT.blur, () => {
        this.updateWindowFocus(false)
      })

      browserWindow.on(CommonAPI.WIN_EVENT.focus, () => {
        this.updateWindowFocus(true)
      })
  }
}
</script>

<style scoped>

</style>