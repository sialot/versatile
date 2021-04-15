<template>
    <div :class="$style['ui-title-container']">
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-left']]">
            todo_menu
        </div>
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-middle']]">
            <span>{{title}}</span>
        </div>
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-right']]">
            <div :class="['codicon', 'codicon-chrome-close', $style['ui-title-btn'], $style['ui-btn-close']]" @click="_close_window()"></div>
            <div v-if="!maximized" :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-maximize']" @click="_maximize_window()"></div>
            <div v-if="maximized" :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-restore']" @click="_unmaximize_window()"></div>
            <div :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-minimize']" @click="_minimize_window()"></div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
const { ipcRenderer } = require('electron')

@Component
class TitleBar extends Vue {
    title:string = 'Versatile';
    maximized: boolean = false;
    created () {

        // 接收窗口事件
        ipcRenderer.on('window-event', this._set_maximized_flag);
    }
    _set_maximized_flag (event: Electron.IpcRendererEvent, flag: string){
        this.maximized = (flag == 'maximize');
    }
    _minimize_window () {
        ipcRenderer.send('title-bar-actions', 'min-app')
    }
    _maximize_window () {
        ipcRenderer.send('title-bar-actions', 'max-app')
    }
    _unmaximize_window() {
        ipcRenderer.send('title-bar-actions', 'unmax-app')
    }
    _close_window () {
        ipcRenderer.send('title-bar-actions', 'close-app')
    }
}

export default TitleBar

</script>

<style module lang="scss">
@import "../assets/global";

.ui-title-container {
    background:$ui-global-win-border-color;
    -webkit-app-region: drag;
    height:$ui-title-bar-height;
    line-height:$ui-title-bar-height;
    vertical-align: middle;
    text-align: center;
    display: -webkit-box;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}

.ui-title-bar {
    -webkit-box-flex:1
}

.ui-title-bar-left{
    text-align: left;
    padding-left: 18px;
}

.ui-title-bar-middle{
    text-align: center;
}

.ui-title-bar-right{
    display: flex;
    flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}

.ui-title-bar-right > .ui-title-btn{
    font-size: 16px;
    height: 100%;
    line-height: $ui-title-bar-height;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 46px;
    -webkit-user-select:none;
    user-select:none;
}
.ui-title-btn:hover{
    background-color:$ui-base-button-color-hover;
}

.ui-btn-close:hover{
    background-color:$ui-close-button-color-hover;
}
</style>