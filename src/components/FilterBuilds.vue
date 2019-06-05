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
              {{ build.number }}
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
          <td v-if="build.started_at < rdate">{{ build.workerid }}</td>
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
              {{ build.number }}
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
          <td v-if="build.started_at > rdate">{{ build.workerid }}</td>
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
