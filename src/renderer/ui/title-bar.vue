<template>
    <div :class="$style['ui-title-container']">
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-left']]">
            TODO_MENU
        </div>
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-middle']]">
            <span>Versatile</span>
        </div>
        <div :class="[$style['ui-title-bar'], $style['ui-title-bar-right']]">
            <div :class="[$style['ui-title-btn'], $style['ui-btn-close']]" @click="_close_window()">关</div>
            <div :class="$style['ui-title-btn']" @click="_maximize_window()">大</div>
            <div :class="$style['ui-title-btn']" @click="_minimize_window()">小</div>
        </div>
    </div>
</template>

<script>
//import { ipcRenderer } from 'electron'

export default {
    name: 'title-bar'
    //,   
    // methods: {
    //     _minimize_window () {
    //         ipcRenderer.send('min-app')
    //     },
    //     _maximize_window () {
    //         ipcRenderer.send('max-app')
    //     },
    //     _close_window () {
    //         ipcRenderer.send('close-app')
    //     }
    // }
}

</script>

<style module lang="scss">
@import "../assets/ui/title-bar";
</style>