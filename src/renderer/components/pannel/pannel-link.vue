<template>
    <div :class="$style['container']" :style="position">
        <div :class="$style['pannel-title']">{{pannelInfo.title}}</div>
        <div :class="$style['pannel-content']"  :style="size">
            <component :is="component" :ID="ID" v-if="component" />
        </div>
    </div>
</template>

<script lang="ts">

/**
 * 动态组件加载器，根据pannelList,加载对应的pannel
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Getter } from 'vuex-class'
import { UIPannel } from '@/core/pannel/PannelManager'

// props 传参接收
const PannelLinkProps = Vue.extend({
    props: {

        // 面板ID
        ID: String
    }
})

@Component
export default class PannelLink extends PannelLinkProps {

    // 内涵组件
    component:any = null;

    // 获取面板列表
    @Getter('pannelList') pannelList!:UIPannel[];
    
    // 当前面板数据
    get pannelInfo(): any{
        for(let i=0;i<this.pannelList.length;i++){
            if(this.pannelList[i].ID == this.ID){
                return this.pannelList[i]
            }
        }
        return null
    }

    get size(): any{
        return {
            height: this.pannelInfo.height +"px",
            width: this.pannelInfo.width +"px"
        }
    }

    get position(): any{
        return {
            top:this.pannelInfo.top + "px",
            left:this.pannelInfo.left + "px"
        }
    }

    // 组件加载器
    get loader(): any {

        if(this.pannelInfo){
            return () => import('@/components/pannel/' + this.pannelInfo.type + '.vue')
        } else {
            return null
        }
    }

    mounted(){

        // 加载组件
        this.loader()
            .then(() => {
                this.component = ()=> this.loader()
            }
        ).catch(
            () => {
                this.component = null
            }
        )
    }
}

</script>

<style module lang="scss">
@import "@/assets/global";
.container{
    background-color:$ui-global-panel-bg-color;
    border: 1px solid red;
    position: absolute;
    overflow: hidden;
}
.pannel-title{
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
}
.pannel-content{
    position: relative;
}
</style>