<template>
    <div>
        <div :class="{[$style['ui-title-resizer-active']]:isWindowFocus, [$style['ui-title-resizer']]:true}" aria-hidden="true"></div>
        <div :class="{[$style['ui-title-container-active']]:isWindowFocus, [$style['ui-title-container']]:true}">
            <div :class="[$style['ui-title-bar'], $style['ui-title-bar-left']]">
                <a :class="[$style['app-icon']]"></a>
                <title-menu></title-menu>
            </div>
            <div :class="[$style['ui-title-bar'], $style['ui-title-bar-middle']]">
                <span>{{title}}</span>
            </div>
            <div :class="[$style['ui-title-bar'], $style['ui-title-bar-right']]">
                <div :class="['codicon', 'codicon-chrome-close', $style['ui-title-btn'], $style['ui-btn-close']]" @click="_close_window()"></div>
                <div v-if="!isMaximized" :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-maximize']" @click="_maximize_window()"></div>
                <div v-if="isMaximized" :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-restore']" @click="_unmaximize_window()"></div>
                <div :class="[$style['ui-title-btn'], 'codicon', 'codicon-chrome-minimize']" @click="_minimize_window()"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import titleMenu from "./title-menu.vue"
import { Getter } from 'vuex-class'
import { browserWindow } from "@/public/CommonAPI"

// 引入组件
@Component({
    components:{titleMenu}
})
class TitleBar extends Vue {

    // 窗口标题
    @Getter('title') public title!:string;

    // 是否最大化、是否窗口获焦
    @Getter('isMaximized') public isMaximized!:string;
    @Getter('isWindowFocus') public isWindowFocus!:string;

    // 按钮方法
    _minimize_window () {
        browserWindow.minimize();
    }
    _maximize_window () {
        browserWindow.maximize();
    }
    _unmaximize_window() {
        browserWindow.unmaximize();
    }
    _close_window () {
        browserWindow.close();
    }
}

export default TitleBar

</script>

<style module lang="scss">
@import "@/assets/global";

.app-icon{
    height: 100%;
    width: 35px;
    background-image: url("~resources/icon/icon.png");
    background-size: 30px 30px;
    background-position: 50%;
}
.ui-title-resizer{
    background:$ui-global-win-border-color;
    height: 2px;
    width: 100%;
    -webkit-app-region: no-drag;
}

.ui-title-resizer-active{
    background:$ui-global-win-border-active-color;
}

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
    div {
        -webkit-user-select:none;
        user-select:none;
    }
    padding-bottom: 2px;
}
.ui-title-container-active {
    background:$ui-global-win-border-active-color;
}
.ui-title-bar {
    -webkit-box-flex:1
}

.ui-title-bar-left{
    display: flex;
    text-align: left;
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
}
.ui-title-btn:hover{
    background-color:$ui-base-button-color-hover;
}

.ui-btn-close:hover{
    background-color:$ui-close-button-color-hover;
}
</style>