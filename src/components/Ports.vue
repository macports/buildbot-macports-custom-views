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
        <h1>
          <a
            :href="
              'https://github.com/macports/macports-ports/tree/master/' +
                info.portdir
            "
            target="_blank"
          >
            {{ info.name }}
          </a>
        </h1>
        <div class="details">
          <strong>Version:</strong> {{ info.version }} <br />
          <strong>Maintainers:</strong>
          <span v-for="(m, index) in info.maintainers" :key="index">
            <a
              v-if="m.github"
              v-bind:href="'https://github.com/' + m.github"
              target="_blank"
            >
              {{ m.github }}</a
            >
            <a
              v-else
              v-bind:href="'mailto:' + m.name + '@' + m.domain"
              target="_top"
            >
              {{ m.name }}</a
            ><span v-if="index + 1 < info.maintainers.length">, </span>
          </span>
          <br />
          <strong>Categories:</strong>
          <span v-for="(c, index) in info.categories" :key="index">
            <a
              :href="
                'https://github.com/macports/macports-ports/tree/master/' + c
              "
              target="_blank"
            >
              {{ c }}</a
            ><span v-if="index + 1 < info.categories.length">, </span>
          </span>
          <br />
          <h3>Builds for {{ info.name }}</h3>
          <table class="table table-hover table-striped table-condensed">
            <tbody>
              <tr>
                <th
                  v-for="(myBuild, index) in getUniqueBuilders(myBuilds)"
                  :key="index"
                >
                  {{ myBuild.builder_name.name }}
                </th>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td v-for="(mb, index) in groups" :key="index">
                  <div class="status" v-if="mb">
                    <tr v-for="(m, index) in mb" :key="index">
                      <div v-if="m.status === 'build successful'">
                        <a href="" target="_blank">
                          <span class="badge-status ng-binding results_SUCCESS">
                            {{ m.build_id }}
                          </span>
                        </a>
                      </div>
                      <div v-else>
                        <a href="" target="_blank">
                          <span class="badge-status ng-binding results_FAILURE">
                            {{ m.build_id }}
                          </span>
                        </a>
                      </div>
                    </tr>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'App',
  data() {
    return {
      info: null,
      myBuilds: null,
      portname: 'nodejs10',
      loading: true,
      errored: false
    }
  },
  mounted() {
    axios
      .get(
        `https://frozen-falls-98471.herokuapp.com/api/v1/port/${
          this.$data.portname
        }/`
      )
      .then(response => (this.info = response.data))
      .catch(error => {
        console.log(error)
        this.errored = true
      })
    axios
      .get(
        `https://frozen-falls-98471.herokuapp.com/api/v1/port/${
          this.$data.portname
        }/builds`
      )
      .then(response => (this.myBuilds = response.data))
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  },
  computed: {
    groups(myBuilds) {
      return _.groupBy(this.myBuilds, e => {
        return e.builder_name.name
      })
    }
  },
  methods: {
    getUniqueBuilders(myBuilds) {
      var flags = [],
        output = [],
        l = myBuilds.length,
        i
      for (i = 0; i < l; i++) {
        if (flags[myBuilds[i].builder_name.name]) continue
        flags[myBuilds[i].builder_name.name] = true
        output.push(myBuilds[i])
      }
      return output
    }
  }
}
</script>

<style scoped>
h1 {
  margin-left: 8px;
}
.details {
  font-size: 18px;
  margin: 8px;
}
.loading {
  position: static;
  margin: 8px 0 0 8px;
}
.spin {
  position: left;
}
.msg {
  font-size: 18px;
  padding-bottom: 8px;
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
</style>
