<template>
  <div>
    <datepicker @selected="doStuff"></datepicker>
    <button @click="changeDir">{{ buttonTxt }}</button>
    <h2 v-if="before">Showing all builds before {{ dt(rdate) }}</h2>
    <h2 v-else>Showing all builds after {{ dt(rdate) }}</h2>
    <table class="table table-hover table-striped table-condensed">
      <tbody>
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
            {{ dt(build.started_at) }}
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
            {{ dt(build.started_at) }}
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
      commit: 'null',
      rdate: new Date().getTime() / 1000,
      minDate: new Date(
        new Date().getFullYear() - 12,
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0
      ),
      maxDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0
      )
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
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    }
  }
}
</script>

<style scoped></style>
