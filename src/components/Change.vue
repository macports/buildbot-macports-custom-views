<template>
  <div class="change-modal">
    <div class="modal-header">
      <button
        @click="$emit('close')"
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <h3 class="modal-title">
        <a v-bind:href="$attrs.change.revlink" target="_blank">{{
          $attrs.change.comments.split('\n')[0]
        }}</a>
      </h3>
    </div>
    <div class="modal-body">
      <h4>Author:</h4>
      {{ $attrs.change.author }}
      <h4>Timestamp:</h4>
      {{ dt($attrs.change.when_timestamp) }}
      <h4>Comments:</h4>
      <code>
        <div
          class="comments"
          v-for="(line, index) in $attrs.change.comments.split('\n')"
          :key="index"
        >
          <div v-html="createLinks(line)"></div>
        </div>
      </code>
      <h4>Changed files:</h4>
      <div v-for="file in $attrs.change.files" :key="file">
        {{ file }}
      </div>
      <h4>Builds:</h4>
      <div
        v-for="(cbs, index) in map(
          $attrs.change.changeid,
          $attrs.change.sourcestamp.ssid
        )"
        :key="index"
      >
        <div v-if="cbs.buildid">
          Buildid: {{ cbs.buildid }}, Builderid: {{ cbs.builderid }}, State:
          {{ cbs.state_string }}
        </div>
        <div v-else>None</div>
      </div>
    </div>
  </div>
</template>

<script>
import Autolinker from 'autolinker'

export default {
  name: 'Change',
  data() {
    return {}
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
      var buildsets = this.$attrs.buildsets
      var builds = this.$attrs.builds
      var changeBuildsets = []
      for (const buildset of buildsets) {
        for (const sourcestamp of buildset.sourcestamps) {
          if (sourcestamp.ssid === ssid) {
            buildset['changeid'] = changeid
            changeBuildsets.push(buildset)
          }
        }
      }
      var buildrequests = this.$attrs.buildrequests
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
      this.$attrs.buildsforchange = changeBuildsets
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
