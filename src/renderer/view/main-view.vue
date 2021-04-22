<template>
    <div :class="$style['container']">
        this is the main-view

        <div v-for="(pannel) in pannelList" :key="pannel.ID">
            <pannel-link :ID="pannel.ID"></pannel-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Getter } from 'vuex-class'
import { UIPannel } from '@/core/pannel/PannelManager'
import pannelLink from '@/components/pannel/pannel-link.vue'

@Component({
    components:{pannelLink}
})
export default class MainView extends Vue {
    @Getter('pannelList') pannelList!:UIPannel[];
}

</script>

<style module lang="scss">
@import "@/assets/global";
.container{
    -webkit-user-select:none;
    user-select:none;
    position:relative;
}

</style>