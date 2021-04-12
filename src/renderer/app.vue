<template>
    <div>
    <div class="app">Hello World</div>
    <router-link to="/demo">to demo page</router-link>
    <router-view/>
    </div>
</template>

<script>
export default {
    name: "App"
}
</script>

<style scoped>
.app {
    font-size: 14px;
    color: aquamarine;
    background: #fff;
}
</style>