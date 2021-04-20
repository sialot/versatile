<template>
    <div :class="$style['container']">
       this the main-view


        <div :class="['ui-pannel']">

        </div>

    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class MainView extends Vue {
  
}

</script>

<style module lang="scss">
@import "@/assets/global";
.container{
    -webkit-user-select:none;
    user-select:none;
}

</style>