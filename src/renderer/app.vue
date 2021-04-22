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
import { Mutation } from 'vuex-class';
import {types, browserWindow} from "@/core/api/CommonAPI"
import * as mutaion_types from '@/store/mutation-types'

@Component({
  components:{titleBar}
})
export default class App extends Vue{

  @Mutation(mutaion_types.UPDATE_MAXIMIZED) updateMaximized!:any;
  @Mutation(mutaion_types.UPDATE_WINFOCUS) updateWindowFocus!:any;

  // 组件创建后
  created () {

      // 接收窗口事件
      browserWindow.on(types.WIN_EVENT.maximize, () => {
        this.updateMaximized(true)
      })

      browserWindow.on(types.WIN_EVENT.unmaximize, () => {
        this.updateMaximized(false)
      })

      browserWindow.on(types.WIN_EVENT.blur, () => {
        this.updateWindowFocus(false)
      })

      browserWindow.on(types.WIN_EVENT.focus, () => {
        this.updateWindowFocus(true)
      })
  }
}
</script>

<style scoped>

</style>