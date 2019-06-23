<template>
  <div id="root">
    <div v-if="showChange == false">
      <div id="dp">
        <datepicker
          :placeholder="formatDate(rdate)"
          :format="'yyyy-MM-dd'"
          @selected="doStuff"
        ></datepicker>
      </div>
      <div id="bt">
        <button class="btn btn-green" @click="changeDir">
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
          <tr v-for="change in changes" :key="change.id">
            <td v-if="change.when_timestamp < rdate" key="a"></td>
            <td v-if="change.when_timestamp < rdate" key="when_timestamp">
              {{ formatDate(change.when_timestamp) }}
            </td>
            <td v-if="change.when_timestamp < rdate" key="comments">
              {{ change.comments }}
            </td>
            <td v-if="change.when_timestamp < rdate" key="committer">
              {{ change.committer }}
            </td>
            <td v-if="change.when_timestamp < rdate" key="author">
              {{ change.author }}
            </td>
            <td v-if="change.when_timestamp < rdate" key="details">
              <button class="btn btn-green" v-on:click="show(change)">
                More
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="change in changes" :key="change.id">
            <td v-if="change.when_timestamp > rdate" key="a"></td>
            <td v-if="change.when_timestamp > rdate" key="when_timestamp">
              {{ formatDate(change.when_timestamp) }}
            </td>
            <td v-if="change.when_timestamp > rdate" key="comments">
              {{ change.comments }}
            </td>
            <td v-if="change.when_timestamp > rdate" key="committer"></td>
            <td v-if="change.when_timestamp > rdate" key="author">
              {{ change.author }}
            </td>
            <td v-if="change.when_timestamp > rdate" key="details">
              <button class="btn btn-green" v-on:click="show(change)">
                More
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <button class="btn btn-danger" @click="showChange = false">
        Go Back
      </button>
      <Change
        :changeId="location.search()['id']"
        :change="this.selectedChange"
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
import Router from 'vue-router'
import Datepicker from 'vuejs-datepicker'
import VModal from 'vue-js-modal'
import Change from './Change'

Vue.use(VModal, {
  dynamic: true,
  injectModalsContainer: true,
  dynamicDefaults: { clickToClose: false }
})

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
      rdate: new Date().getTime() / 1000
    }
  },
  methods: {
    show(change) {
      this.$data.location.search('id', change.changeid)
      this.selectedChange = change
      this.showChange = true

      // this.$data.rootScope.location = this.$data.location
      // console.log(this.$data.rootScope)
      // this.$data.rootScope.$on('$locationChangeSuccess', () => {
      //   this.$data.location.search()['id']
      //   // this.$data.location.search('id', 10)
      // })

      // this.$modal.show(
      //   Change,
      //   {
      //     change: change,
      //     builders: this.$data.builders,
      //     builds: this.$data.builds,
      //     buildrequests: this.$data.buildrequests,
      //     buildsets: this.$data.buildsets,
      //     buttons: [
      //       {
      //         title: 'Close'
      //       }
      //     ]
      //   },
      //   {
      //     width: 1000,
      //     height: 'auto',
      //     pivotX: 0.8,
      //     scrollable: true,
      //     resizable: true
      //   },
      //   // {
      //   //   'before-close': event => {
      //   //     console.log('this will be called before the modal closes')
      //   //     this.$router.go(-1)
      //   //     this.$emit('close')
      //   //   }
      //   // }
      // )
    },
    hide() {
      this.$modal.hide(Change)
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
