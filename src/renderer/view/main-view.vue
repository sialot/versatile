<template>
    <div :class="$style['container']">
       this the main-view
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
export default class MainView extends Vue {

    @Getter('globalState') globalState!:State
}

</script>

<style module lang="scss">
@import "@/assets/global";
.container{
    -webkit-user-select:none;
    user-select:none;
    pre{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
}

</style>