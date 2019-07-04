<template>
  <div id="root">
    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try back later
      </p>
    </section>
    <section v-else>
      <div
        v-if="loading"
        class="load-indicator spinner loading"
      >
        <i class="fa fa-circle-o-notch fa-spin fa-2x spin" />
        <span class="msg">Crunching latest data...</span>
      </div>
      <div v-else>
        <input
          v-model="search"
          type="text"
          placeholder="Search for port"
        >
        <br>
        <div v-if="showPort || location.$$url !== '/ports'">
          <Port :portname="location.search()['id']" />
        </div>
        <br>
        <div
          v-for="(port, index) in filteredPorts"
          :key="index"
          class="btn-group-vertical group"
        >
          <button
            type="button"
            class="btn btn-default"
            @click="setId(port.name)"
          >
            {{ port.name }}
          </button>
          <br>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios'
import Port from './Port.vue'

export default {
  name: 'PortsList',
  components: {
    Port
  },
  data() {
    return {
      search: '',
      portsList: null,
      loading: true,
      errored: false,
      showPort: false
    }
  },
  computed: {
    filteredPorts() {
      return this.portsList.filter(port => {
        return port.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
  mounted() {
    axios
      .get('http://ec2-52-34-234-111.us-west-2.compute.amazonaws.com/api/v1/ports/25000/page/1/')
      .then(response => (this.portsList = response.data))
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    setId(portname) {
      this.$data.location.search('id', portname)
      this.$data.scope.$apply()
    }
  }
}
</script>
<style scoped>
#root {
  margin: 8px;
}
.group {
  margin: 0px 1px;
}
</style>
