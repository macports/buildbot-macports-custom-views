<template>
  <div id="root">
    <div v-if="showChange == false && location.$$url == '/changeslist'">
      <div id="dp">
        <datepicker
          :placeholder="formatDate(rdate)"
          :format="'yyyy-MM-dd'"
          @selected="doStuff"
        />
      </div>
      <div id="bt">
        <button
          class="btn btn-green"
          @click="changeDir"
        >
          {{ buttonTxt }}
        </button>
      </div>
      <h2 v-if="before">
        Showing all changes before
        {{ formatDate(rdate) }}
      </h2>
      <h2 v-else>
        Showing all changes after
        {{ formatDate(rdate) }}
      </h2>
      <table class="table table-hover table-striped table-condensed">
        <tbody id="htb">
          <tr>
            <th>
              Build Status
            </th>
            <th>Timestamp</th>
            <th>Comments</th>
            <th>Committer</th>
            <th>Author</th>
            <th>Details</th>
          </tr>
        </tbody>
        <tbody v-if="before">
          <tr
            v-for="change in changes"
            :key="change.id"
          >
            <td
              v-if="change.when_timestamp < rdate"
              key="a"
            />
            <td
              v-if="change.when_timestamp < rdate"
              key="when_timestamp"
            >
              {{ formatDate(change.when_timestamp) }}
            </td>
            <td
              v-if="change.when_timestamp < rdate"
              key="comments"
            >
              {{ change.comments.split('\n')[0] }}
            </td>
            <td
              v-if="change.when_timestamp < rdate"
              key="committer"
            >
              {{ removeEmail(change.committer) }}
            </td>
            <td
              v-if="change.when_timestamp < rdate"
              key="author"
            >
              {{ removeEmail(change.author) }}
            </td>
            <td
              v-if="change.when_timestamp < rdate"
              key="details"
            >
              <button
                class="btn btn-green"
                @click="show(change)"
              >
                More
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr
            v-for="change in changes"
            :key="change.id"
          >
            <td
              v-if="change.when_timestamp > rdate"
              key="a"
            />
            <td
              v-if="change.when_timestamp > rdate"
              key="when_timestamp"
            >
              {{ formatDate(change.when_timestamp) }}
            </td>
            <td
              v-if="change.when_timestamp > rdate"
              key="comments"
            >
              {{ change.comments.split('\n')[0] }}
            </td>
            <td
              v-if="change.when_timestamp > rdate"
              key="committer"
            >
              {{ removeEmail(change.committer) }}
            </td>
            <td
              v-if="change.when_timestamp > rdate"
              key="author"
            >
              {{ removeEmail(change.author) }}
            </td>
            <td
              v-if="change.when_timestamp > rdate"
              key="details"
            >
              <button
                class="btn btn-green"
                @click="show(change)"
              >
                More
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <button
        class="btn btn-danger"
        @click="
          showChange = false
          location.search({})
        "
      >
        Go Back
      </button>
      <Change
        :location="location"
        :change-id="location.search()['id']"
        :change="selectedChange"
        :builds="builds"
        :builders="builders"
        :buildrequests="buildrequests"
        :buildsets="buildsets"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Datepicker from 'vuejs-datepicker'
import Change from './Change'

export default {
  name: 'App',
  components: {
    Change,
    Datepicker
  },
  data() {
    return {
      showChange: false,
      selectedChange: {},
      buttonTxt: 'Show changes after this date',
      before: true,
      rdate: new Date().getTime() / 1000,
      loading: true,
      errored: false
    }
  },
  methods: {
    show(change) {
      this.$data.location.search('id', change.changeid)
      this.selectedChange = change
      this.showChange = true
      this.$data.scope.$apply()
    },
    changeDir: function() {
      if (this.$data.before) {
        this.$data.before = false
        this.$data.buttonTxt = 'Show changes before this date'
      } else {
        this.$data.before = true
        this.$data.buttonTxt = 'Show changes after this date'
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
    },
    removeEmail: function(s) {
      if (s != null) {
        s = s.substring(0, s.indexOf('<'))
      }
      return s
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
