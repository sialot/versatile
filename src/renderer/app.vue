<template>
  <div id="main">
    <title-bar></title-bar>
    <router-view></router-view> 
  </div>
</template>

<script lang="ts">
import titleBar from '@/components/ui/title-bar.vue'
export default {
  components: { titleBar },
  name: "App"
}
</script>

<style scoped>

</style>