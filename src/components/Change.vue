<template>
  <div class="change-modal">
    <div v-if="loading" />
    <div v-else>
      <div class="modal-header">
        <h3 class="modal-title">
          <a
            :href="change.revlink"
            target="_blank"
          >{{
            change.comments.split('\n')[0]
          }}</a>
        </h3>
      </div>
      <div class="modal-body">
        <h4>Author:</h4>
        {{ change.author }}
        <h4>Committer:</h4>
        {{ change.committer }}
        <h4>Timestamp:</h4>
        {{ dt(change.when_timestamp) }}
        <h4>Comments:</h4>
        <code>
          <div
            v-for="(line, index) in change.comments.split('\n')"
            :key="index"
            class="comments"
          >
            <div v-html="createLinks(line)" />
          </div>
        </code>
        <h4>Changed files:</h4>
        <div
          v-for="file in change.files"
          :key="file"
        >
          {{ file }}
        </div>
        <h4>Builds:</h4>
        <div
          v-for="(cbs, index) in map(change.changeid, change.sourcestamp.ssid)"
          :key="index"
        >
          <div v-if="cbs.buildid">
            Buildid: {{ cbs.buildid }}, Builderid: {{ cbs.builderid }}, State:
            {{ cbs.state_string }}
          </div>
          <div v-else>
            None
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Autolinker from 'autolinker'
import axios from 'axios'

export default {
  name: 'Change',
  props: {
    change: Object,
    builders: Array,
    builds: Array,
    buildrequests: Array,
    buildsets: Array,
    location: Object,
    changeId: Number
  },
  data() {
    return {
      loading: true,
      errored: false,
      baseURL: window.location.origin
    }
  },
  mounted() {
    console.log(this.$props)
    if ('changeid' in this.$props.change) {
      this.loading = false
    } else {
      axios
        .get(`${this.baseURL}/api/v2/changes/${this.$props.changeId}`)
        .then(response => {
          this.change = response.data.changes[0]
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => (this.loading = false))
    }
  },
  methods: {
    getResult: function(b) {
      let result
      if (!b.complete && b.started_at >= 0) {
        result = 'pending'
      } else {
        switch (b.results) {
          case 0:
            result = 'success'
            break
          case 1:
            result = 'warnings'
            break
          case 2:
            result = 'failure'
            break
          case 3:
            result = 'skipped'
            break
          case 4:
            result = 'exception'
            break
          case 5:
            result = 'cancelled'
            break
          default:
            result = 'unknown'
        }
      }
      return result
    },
    map: function(changeid, ssid) {
      var buildsets = this.$props.buildsets
      var builds = this.$props.builds
      var changeBuildsets = []
      for (const buildset of buildsets) {
        for (const sourcestamp of buildset.sourcestamps) {
          if (sourcestamp.ssid === ssid) {
            buildset['changeid'] = changeid
            changeBuildsets.push(buildset)
          }
        }
      }
      var buildrequests = this.$props.buildrequests
      for (const buildrequest of buildrequests) {
        for (const changeBuildset of changeBuildsets) {
          if (changeBuildset.bsid === buildrequest.buildsetid) {
            changeBuildset['buildrequestid'] = buildrequest.buildrequestid
          }
        }
      }
      for (const build of builds) {
        for (const changeBuildset of changeBuildsets) {
          if (changeBuildset.buildrequestid === build.buildrequestid) {
            changeBuildset['buildid'] = build.buildid
            changeBuildset['builderid'] = build.builderid
            changeBuildset['state_string'] = build.state_string
            changeBuildset['complete'] = build.complete
            changeBuildset['complete_at'] = build.complete_at
            changeBuildset['started_at'] = build.started_at
            changeBuildset['results'] = build.results
          }
        }
      }
      this.$props.buildsforchange = changeBuildsets
      var myarray = []
      for (const cbs of changeBuildsets) {
        myarray.push({
          buildid: cbs.buildid,
          builderid: cbs.builderid,
          state_string: cbs.state_string,
          complete: cbs.complete,
          complete_at: cbs.complete_at,
          started_at: cbs.started_at,
          results: cbs.results
        })
      }
      return myarray
    },
    createLinks: function(text) {
      var linkedText = Autolinker.link(text)
      return linkedText
    },
    dt: function(timestamp) {
      return new Date(timestamp * 1000)
    }
  }
}
</script>

<style scoped>
.change-modal {
  margin: 12px;
}
.comments {
  padding-right: 8px;
}
.modal-body {
  font-size: 15px;
}
</style>
