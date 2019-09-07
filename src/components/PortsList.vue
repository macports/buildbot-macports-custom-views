<template>
  <div id="root">
    <div v-if="showPort || location.$$url !== '/ports'">
      <Port
        :portname="location.search()['id']"
        :location="location"
      />
    </div>
    <uib-pagination
      v-model="pagination"
      class="pagination-sm"
      :items-per-page="pageSize"
      :total-items="filteredBuilders.length"
    />
    <form
      role="search"
      style="width:150px"
    >
      <input
        v-model="search"
        type="text"
        class="form-control"
        placeholder="Search for ports"
      >
    </form>
    <br>
    <table
      style="width:200px"
      class="table table-hover table-striped table-condensed"
    >
      <tbody id="htb">
        <tr>
          <th>Port</th>
        </tr>
      </tbody>
      <tbody>
        <tr
          v-for="(buildername, index) in filteredBuilders.slice(
            pageSize * (pagination.currentPage - 1),
            pageSize * (pagination.currentPage - 1) + pageSize
          )"
          :key="index"
        >
          <td>
            <a
              role="button"
              @click="setId(buildername)"
            >
              {{ buildername }}
            </a>
            <br>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Port from './Port.vue'

import _ from 'lodash'
import Vue from 'vue'
import pagination from 'vuejs-uib-pagination'

Vue.use(pagination)

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
      showPort: false,
      pagination: {}
    }
  },
  computed: {
    filteredBuilders() {
      return [
        ...new Set(
          this.builders
            .filter(builder => {
              if (builder.tags.includes('_virtual_')) {
                if (builder.name.includes('_')) {
                  return (
                    builder.name
                      .slice(0, builder.name.indexOf('_'))
                      .toLowerCase()
                      .indexOf(this.search.toLowerCase()) > -1
                  )
                } else {
                  return (
                    builder.name
                      .toLowerCase()
                      .indexOf(this.search.toLowerCase()) > -1
                  )
                }
              }
            })
            .map(builder => {
              if (builder.name.includes('_')) {
                return builder.name.slice(0, builder.name.indexOf('_'))
              } else {
                return builder.name
              }
            })
        )
      ].sort()
    }
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
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}
th {
  background-color: #42b983;
  color: rgba(255, 255, 255);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#htb > tr > th {
  background-color: #42b983;
}
</style>
