<template>
    <div :class="$style['container']">
        <pre>
{{globalState}}
        </pre>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Getter } from 'vuex-class'
import { State } from '@/store/index'

@Component
export default class dataViewer extends Vue {
    @Getter('globalState') globalState!:State;
}
</script>

<style module lang="scss">
@import "@/assets/global";
.container{
    position: relative;
    height: 100%;
    -webkit-user-select:text;
    user-select:text;
    pre{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
    }
    background-color:$ui-global-bg-color;
    overflow:auto;
}

</style>