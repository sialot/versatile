<template>
    <title-bar></title-bar> 
</template>

<script lang="ts">
import titleBar from './ui/title-bar.vue'
const { ipcRenderer } = require('electron')
console.log("run")

export default {
  components: { titleBar },
  name: "App"
}
</script>

<style scoped>

</style>