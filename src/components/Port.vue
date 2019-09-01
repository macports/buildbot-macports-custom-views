<template>
  <div>
    <section v-if="errored">
      <p>
        We're sorry, we're not able to retrieve this information at the moment,
        please try again later
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
        <h1>
          <a
            :href="'https://ports.macports.org/port/' + portname"
            target="_blank"
          >
            {{ portname }}
          </a>
        </h1>
        <table class="table table-hover table-striped table-condensed">
          <tbody>
            <tr>
              <th
                v-for="(bldr, index) in info"
                :key="index"
                style="background-color: #42b983"
              >
                {{ bldr.name }}
              </th>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td
                v-for="(mb, index) in buildsByBuilder"
                :key="index"
              >
                <div
                  v-if="mb"
                  class="status"
                >
                  <tr
                    v-for="(build, index2) in mb.data.builds"
                    :key="index2"
                  >
                    <a
                      :href="
                        baseURL +
                          '#/builders/' +
                          build.builderid +
                          '/builds/' +
                          build.number
                      "
                      target="_blank"
                    >
                      <span
                        :class="setResultBadge(build)"
                        class="badge-status ng-binding "
                      >
                        {{ build.builderid }}/{{ build.number }}
                      </span>
                    </a>
                  </tr>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Port',
  props: { portname: String, location: Object },
  data() {
    return {
      info: null,
      myBuilds: null,
      buildsByBuilder: null,
      baseURL: window.location.origin,
      loading: true,
      errored: false
    }
  },
  watch: {
    portname: function(newVal, oldVal) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      const portname = this.$props.portname
      axios
        .get(
          `${window.location.origin}/api/v2/builders?name__contains=${this.$props.portname}_`
        )
        .then(response => {
          this.info = []
          for (const testBuilder of response.data.builders) {
            if (testBuilder.name.substring(0, portname.length) == portname) {
              this.info.push(testBuilder)
            }
          }
        })
        .then(() => {
          let promises = [],
            myUrl,
            buildsByBuilder
          this.info.forEach(function(builder) {
            myUrl = `${window.location.origin}/api/v2/builders/${builder.name}/builds`
            promises.push(axios.get(myUrl))
          })
          axios.all(promises).then(results => {
            this.buildsByBuilder = results
          })
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },
    setResultBadge: function(b) {
      let result
      if (!b.complete && b.started_at >= 0) {
        result = 'PENDING'
      } else {
        switch (b.results) {
          case 0:
            result = 'SUCCESS'
            break
          case 1:
            result = 'WARNINGS'
            break
          case 2:
            result = 'FAILURE'
            break
          case 3:
            result = 'SKIPPED'
            break
          case 4:
            result = 'EXCEPTION'
            break
          case 5:
            result = 'CANCELLED'
            break
          default:
            result = 'unknown'
        }
      }
      return 'results_' + result
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
