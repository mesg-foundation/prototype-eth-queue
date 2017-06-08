<template>
  <div>
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="creator"
          name="creator"
          label="Your ETH address"
          :hint="error"
          id="creator">
        </v-text-field>
      </v-card-text>
    </v-card>
    <v-list>
      <v-list-group v-for="hook in hooks" :value="hook.active" :key="hook.index">
        <v-list-tile slot="item">
          <v-list-tile-content>
            <v-list-tile-title>{{ hook.httpEndpoint }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-item v-for="hook in hooks" :key="hook.index">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Contract Address</v-list-tile-title>
              <v-list-tile-sub-title>{{ hook.contractAddress }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>content_copy</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Event</v-list-tile-title>
              <v-list-tile-sub-title>{{ hook.eventName }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>content_copy</v-icon>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Notification email</v-list-tile-title>
              <v-list-tile-sub-title>{{ hook.email }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>content_copy</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
  export default {
    name: 'Hooks',
    data () {
      return {
        error: null,
        creator: '0x0000C48bd972e0218fa73D8E61873a877f1F79e4'.toLowerCase()
      }
    },
    computed: {
      hooks () {
        return this.$store.getters['ethereum/hooks'][this.creator.toLowerCase()]
      }
    },
    watch: {
      creator () {
        this.loadHooks()
      }
    },
    methods: {
      loadHooks () {
        if (this.creator.length !== 42) { return }
        if (this.creator.substr(0, 2) !== '0x') { return }
        this.$store.dispatch('ethereum/hooks', {
          creator: this.creator
        })
      }
    },
    mounted () {
      this.loadHooks()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../variables'
</style>

