<template>
    <div :class="$style['menu-container']">
        <div>
            <div :class="$style['menu-title']">文件</div>
            <div :class="$style['menu-item']">
                <ul>
                    <li>
                        <div :class="$style['menu-item-text']">
                            <span class="">新建</span>
                        </div>
                        <div :class="$style['menu-item-shortcut']">
                            <span>Ctrl+N</span>
                        </div>
                    </li>
                    <li>
                        <div :class="$style['menu-item-text']">
                            <span class="">新建1</span>
                        </div>
                        <div :class="$style['menu-item-shortcut']">
                            <span>Ctrl+N</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <div :class="$style['menu-title']">帮助</div>            
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class TitleMenu extends Vue {
   menutest:string = "运行任务 !"
}

</script>

<style module lang="scss">
@import "../assets/global";
.menu-container{
    display: flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
}
.menu-title{
    padding: 0px 12px;
    height: 100%;
    -webkit-app-region: no-drag;
    -webkit-user-select:none;
    user-select:none;
}
.menu-title:hover{
    background-color: $ui-base-button-color-hover;
}
.menu-item{
    position: absolute;
    min-width: 200px;
    background: $ui-global-panel-bg-dark-color;    
    padding: 4px 0;
    ul{
        list-style:none;
        margin:0px;
        padding:0px;
        li {
            display: -webkit-box;
            margin:4px 0px;
            padding:4px 24px;
            div {
                display: flex;
                -webkit-user-select:none;
                user-select:none;
                -webkit-box-flex:1;
                line-height: 22px;
                span{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        li:hover {
            background-color: $ui-global-menu-bg-hover-color;
        }
    }
}

.menu-item-text {
    margin:0 30px 0 0;
}

.menu-item-shortcut {
    margin:0 0 0 30px;
    flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
}

</style>