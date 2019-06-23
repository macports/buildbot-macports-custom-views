<template>
  <div id="root">
    <div id="dp">
      <datepicker
        :placeholder="formatDate(rdate)"
        :format="'yyyy-MM-dd'"
        @selected="doStuff"
      ></datepicker>
    </div>
    <div id="bt">
      <button class="btn btn-green" @click="changeDir">{{ buttonTxt }}</button>
    </div>
    <h2 v-if="before">
      Showing all builds before
      {{ formatDate(rdate) }}
    </h2>
    <h2 v-else>
      Showing all builds after
      {{ formatDate(rdate) }}
    </h2>
    <table class="table table-hover table-striped table-condensed">
      <tbody id="htb">
        <tr>
          <th>Build</th>
          <th>Started at</th>
          <th>Status</th>
          <th>Builder</th>
          <th>Port(s) affected</th>
          <th>Worker</th>
        </tr>
      </tbody>
      <tbody v-if="before">
        <tr v-for="build in builds" :key="build.id">
          <td v-if="build.started_at < rdate">
            <a
              v-bind:href="
                '/#/builders/' + build.builderid + '/builds/' + build.number
              "
              target="_blank"
            >
              <span
                v-bind:class="setResultBadge(build)"
                class="badge-status ng-binding"
              >
                {{ build.number }}
              </span>
            </a>
          </td>
          <td v-if="build.started_at < rdate">
            {{ formatDate(build.started_at) }}
          </td>
          <td v-if="build.started_at < rdate">{{ build.state_string }}</td>
          <td v-if="build.started_at < rdate">
            {{ getBuilderDetails(build.builderid)[0] }}
          </td>
          <td v-if="build.started_at < rdate">
            {{ build.properties.portname }}
          </td>
          <td v-if="build.started_at < rdate">
            <a v-bind:href="'/#/workers/' + build.workerid" target="_blank">
              <span
                :class="setWorkerStatus(getWorkerDetails(build.workerid))"
                class="badge-status ng-binding"
              >
                {{ getWorkerDetails(build.workerid).name }}
              </span>
            </a>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="build in builds" :key="build.id">
          <td v-if="build.started_at > rdate">
            <a
              v-bind:href="
                '/#/builders/' + build.builderid + '/builds/' + build.number
              "
              target="_blank"
            >
              <span
                v-bind:class="setResultBadge(build)"
                class="badge-status ng-binding"
              >
                {{ build.number }}
              </span>
            </a>
          </td>
          <td v-if="build.started_at > rdate">
            {{ formatDate(build.started_at) }}
          </td>
          <td v-if="build.started_at > rdate">{{ build.state_string }}</td>
          <td v-if="build.started_at > rdate">
            {{ getBuilderDetails(build.builderid)[0] }}
          </td>
          <td v-if="build.started_at > rdate">
            {{ build.properties.portname }}
          </td>
          <td v-if="build.started_at > rdate">
            <a v-bind:href="'/#/workers/' + build.workerid" target="_blank">
              <span
                :class="setWorkerStatus(getWorkerDetails(build.workerid))"
                class="badge-status ng-binding"
              >
                {{ getWorkerDetails(build.workerid).name }}
              </span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'App',
  components: {
    Datepicker
  },
  data() {
    return {
      buttonTxt: 'Show builds after this date',
      before: true,
      rdate: new Date().getTime() / 1000
    }
  },
  methods: {
    setWorkerStatus: function(w) {
      if (w.connected_to.length) {
        return 'results_SUCCESS'
      } else {
        return 'results_FAILURE'
      }
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
    },
    getWorkerDetails: function(workerid) {
      var workers = this.$data.workers
      for (const worker of workers) {
        if (workerid === worker.workerid) {
          return worker
        }
      }
    },
    getBuilderDetails: function(builderid) {
      var builders = this.$data.builders
      for (const builder of builders) {
        if (builderid === builder.builderid) {
          return [builder.name, builder.tags]
        }
      }
    },
    changeDir: function() {
      if (this.$data.before) {
        this.$data.before = false
        this.$data.buttonTxt = 'Show builds before this date'
      } else {
        this.$data.before = true
        this.$data.buttonTxt = 'Show builds after this date'
      }
    },
    doStuff: function(date) {
      console.log('original ' + this.$data.rdate)
      this.$data.rdate = date.getTime() / 1000
      console.log('final ' + this.$data.rdate)
    },
    formatDate: function(timestamp) {
      var d = new Date(timestamp * 1000)
      var month = '' + (d.getUTCMonth() + 1)
      var day = '' + d.getUTCDate()
      var year = d.getUTCFullYear()
      var hours = '' + d.getUTCHours()
      var minutes = '' + d.getUTCMinutes()
      var seconds = '' + d.getUTCSeconds()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      if (hours.length < 2) hours = '0' + hours
      if (minutes.length < 2) minutes = '0' + minutes
      if (seconds.length < 2) seconds = '0' + seconds

      return (
        [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':')
      )
    }
  }
}
</script>

<style scoped>
#root {
  margin: 8px;
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
#dp {
  display: inline-block;
  margin-right: 10px;
  height: 50px;
}
#bt {
  display: inline-block;
  height: 50px;
  color: #ffffff;
}
.btn-green {
  background-color: #42b983;
  color: #ffffff;
}
#htb > tr > th {
  background-color: #42b983;
}
</style>
