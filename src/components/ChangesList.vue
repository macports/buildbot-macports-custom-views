<template>
  <div>
    <datepicker @selected="doStuff"></datepicker>
    <button @click="changeDir">{{ buttonTxt }}</button>
    <h2 v-if="before">Showing all changes before {{ dt(rdate) }}</h2>
    <h2 v-else>Showing all changes after {{ dt(rdate) }}</h2>
    <router-view></router-view>
    <table class="table table-hover table-striped table-condensed">
      <tbody>
        <tr>
          <th>Build Status</th>
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
            {{ dt(change.when_timestamp) }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="comments">
            {{ change.comments }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="committer"></td>
          <td v-if="change.when_timestamp < rdate" key="author">
            {{ change.author }}
          </td>
          <td v-if="change.when_timestamp < rdate" key="details">
            <router-link
              :to="{ name: 'change', params: { id: change.changeid } }"
            >
              <button class="btn btn-primary" v-on:click="show(change)">
                More
              </button>
            </router-link>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="change in changes" :key="change.id">
          <td v-if="change.when_timestamp > rdate" key="a"></td>
          <td v-if="change.when_timestamp > rdate" key="when_timestamp">
            {{ dt(change.when_timestamp) }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="comments">
            {{ change.comments }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="committer"></td>
          <td v-if="change.when_timestamp > rdate" key="author">
            {{ change.author }}
          </td>
          <td v-if="change.when_timestamp > rdate" key="details">
            <router-link
              :to="{ name: 'change', params: { id: change.changeid } }"
            >
              <button class="btn btn-primary" v-on:click="show(change)">
                More
              </button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
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
    Datepicker
  },
  data() {
    return {
      buttonTxt: 'Show changes after this date',
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
    show(change) {
      this.$modal.show(
        Change,
        {
          change: change,
          builders: this.$data.builders,
          builds: this.$data.builds,
          buildrequests: this.$data.buildrequests,
          buildsets: this.$data.buildsets,
          buttons: [
            {
              title: 'Close'
            }
          ]
        },
        {
          width: 1000,
          height: 'auto',
          pivotX: 0.8,
          scrollable: true,
          resizable: true
        },
        {
          'before-close': event => {
            console.log('this will be called before the modal closes')
            this.$router.go(-1)
            this.$emit('close')
          }
        }
      )
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
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    }
  }
}
</script>

<style scoped></style>
