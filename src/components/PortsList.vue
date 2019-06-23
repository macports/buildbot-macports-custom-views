<template>
  <div id="root">
    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try back later
      </p>
    </section>
    <section v-else>
      <div v-if="loading" class="load-indicator spinner loading">
        <i class="fa fa-circle-o-notch fa-spin fa-2x spin"></i>
        <span class="msg">Crunching latest data...</span>
      </div>
      <div v-else>
        <input type="text" v-model="search" />
        <br />
        <div>
          <Port :portname="location.search()['id']" />
        </div>
        <div
          class="btn-group-verticalq"
          v-for="(port, index) in filteredPorts"
          :key="index"
        >
          <button
            type="button"
            class="btnq btn-defaultq"
            @click="setId(port.name)"
          >
            {{ port.name }}
          </button>
          <br />
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
      errored: false
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
      .get(`http://frozen-falls-98471.herokuapp.com/api/v1/ports/25000/page/1/`)
      .then(response => (this.portsList = response.data))
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    setId(portname) {
      // this.$data.location.search('id', portname)
    }
  }
}
</script>
<style scoped></style>
