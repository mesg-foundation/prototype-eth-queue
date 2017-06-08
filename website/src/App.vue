<template>
  <v-app>
    <application-toolbar></application-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import ApplicationToolbar from '@/components/ApplicationToolbar'
export default {
  components: {
    ApplicationToolbar
  }
}
</script>

<style lang="stylus">
  @import './theme'
</style>
