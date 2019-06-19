<template>
  <div>
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
        <p>{{ location }}</p>
        <input type="text" v-model="search" />
        <div v-for="(port, index) in filteredPorts" :key="index">
          <button @click="setId">{{ port.name }}</button>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from 'axios'

export default {
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
      .get(`http://frozen-falls-98471.herokuapp.com/api/v1/ports/25/page/1/`)
      .then(response => (this.portsList = response.data))
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  },
  methods: {
    setId() {
      //   this.$data.location.$$path = '/ports/gh'
      //   this.$data.location.$$search = '/gh'
      this.$data.location.search()['id']
    }
  }
}
</script>
<style scoped></style>
