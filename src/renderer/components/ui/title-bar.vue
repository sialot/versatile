<template>
    <div :class="$style['ui-title-bar']">This is the title bar!</div>
</template>

<script>
export default {
    name: "TitleBar"
}
</script>

<style module>
.ui-title-bar {
    background: #323233;
    -webkit-app-region: drag;
    height:40px;
    margin:0px;
    padding:0px;
}
</style>