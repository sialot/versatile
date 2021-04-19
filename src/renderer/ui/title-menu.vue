<template>
    <div :class="$style['menu-container']">
        <div v-for="(data, i) in menuList" :key="i">
            <div v-if="!(currentActiveIndex == i)" :class="$style['menu-title']" @mouseover="_overTitle(i)"  @click="_showTitle(i)">{{data.title}}</div>
            <div v-if="(currentActiveIndex == i)" :class="[$style['menu-title'], $style['menu-title-active']]"  @click="_showTitle(i)">{{data.title}}</div>
            <div v-show="(currentActiveIndex == i)" :class="$style['menu-item']">
                <ul>
                    <li v-for="(item, j) in data.items" :key="j" @click="_onClick(i,j)">
                        <div :class="$style['menu-item-text']">
                            <span class="">{{item.text}}</span>
                        </div>
                        <div :class="$style['menu-item-shortcut']">
                            <span>{{item.shortcut}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {browserWindow} from "../public/CommonAPI"

interface MenuItem{
    text:string,
    shortcut:string,
    onClick:() => void
}
interface MenuData{
    title:string,
    items:MenuItem[]
}

@Component
export default class TitleMenu extends Vue {
    currentActiveIndex:number = -1;
    isMeClick:boolean = false;
    menutest:string = "运行任务 !"
    menuList:MenuData[] = [{
        title:"文件",
        items:[
        {
            text:"保存",
            shortcut:"Ctrl+S",
            onClick: function ():void{
                console.log(this.text)
            }
        },{
            text:"退出",
            shortcut:"",
            onClick: function ():void{
                browserWindow.close();
            }
        }]
    },
    {
        title:"帮助",
        items:[
        {
            text:"开发人员工具",
            shortcut:"",
            onClick: function ():void{
                browserWindow.openDevTools();
            }
        },{
            text:"关于",
            shortcut:"",
            onClick: function ():void{
                console.log(this.text)
            }
        }]
    }];

    mounted(){

        // 注册全局单击关闭菜单
        this.$globalClick(this.closeAll.bind(this));
    }

    _isClosed():boolean{
        return this.currentActiveIndex == -1
    }

    // 菜单标题mouseover
    _overTitle(menuInex:number):void{

        // 未展开忽略事件
        if(this._isClosed()) {
            return;
        }

        this.currentActiveIndex = menuInex
    }

    // 菜单标题单击
    _showTitle(menuInex:number):void{

        // 是我的单击事件，用于屏蔽全局单击事件
        this.isMeClick = true;

        // 展开或关闭
        if(this.currentActiveIndex == menuInex){
            this.closeAll();
        }else{
            this.currentActiveIndex = menuInex
        }
    }

    // 菜单项单击
    _onClick(menuIndex:number, itemIndex:number):void{

        // 是我的单击事件，用于屏蔽全局单击事件
        this.isMeClick = true;
        this.menuList[menuIndex].items[itemIndex].onClick();
        this.closeAll();
    }

    // 关闭所有菜单
    closeAll():void{

        // 是我的单击事件，屏蔽全局单击事件
        if(this.isMeClick){
            this.isMeClick = false;
            return
        }
        this.currentActiveIndex = -1;
    }
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
    min-width: 46px;
    text-align: center;
    -webkit-app-region: no-drag;
    -webkit-user-select:none;
    user-select:none;
}

.menu-title-active{
    background-color: $ui-base-button-color-hover;
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
            margin:1px 0px;
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