import Vue from 'vue'
import ChangesList from './components/ChangesList.vue'

import axios from 'axios'

angular
  .module('buildbot_macports_custom_views')
  .config([
    'bbSettingsServiceProvider',
    bbSettingsServiceProvider => {
      bbSettingsServiceProvider.addSettingsGroup({
        name: 'ChangesList',
        caption: 'Changes List page related settings',
        items: [
          {
            type: 'integer',
            name: 'buildLimit',
            caption: 'Number of builds to fetch',
            default_value: 200
          },
          {
            type: 'integer',
            name: 'builderLimit',
            caption: 'Number of builders to fetch',
            default_value: 200
          },
          {
            type: 'integer',
            name: 'buildsetLimit',
            caption: 'Number of buildsets to fetch',
            default_value: 2000
          },
          {
            type: 'integer',
            name: 'buildrequestLimit',
            caption: 'Number of buildrequests to fetch',
            default_value: 2000
          },
          {
            type: 'integer',
            name: 'changeLimit',
            caption: 'Number of changes to fetch',
            default_value: 30
          }
        ]
      })
    }
  ])
  .directive('changesDirective', [
    '$q',
    '$window',
    'dataService',
    'bbSettingsService',
    'resultsService',
    '$uibModal',
    '$timeout',
    '$location',
    (
      $q,
      $window,
      dataService,
      bbSettingsService,
      resultsService,
      $uibModal,
      $timeout,
      $location
    ) => {
      const settings = bbSettingsService.getSettingsGroup('ChangesList')

      function link(scope, element, attrs) {
        // create an instance of the data accessor
        const dataAccessor = dataService.open().closeOnDestroy(scope)

        const builders = dataAccessor.getBuilders({
          limit: settings.builderLimit.value,
          order: '-builderid'
        })
        const builds = dataAccessor.getBuilds({
          limit: settings.buildLimit.value,
          order: '-started_at',
          property: '*'
        })
        const buildrequests = dataAccessor.getBuildrequests({
          limit: settings.buildrequestLimit.value,
          order: '-submitted_at'
        })
        const workers = dataAccessor.getWorkers({
          order: '-workerid'
        })
        const buildsets = dataAccessor.getBuildsets({
          limit: settings.buildsetLimit.value,
          order: '-submitted_at'
        })
        const changes = dataAccessor.getChanges({
          limit: settings.changeLimit.value,
          order: '-changeid'
        })
        const changesources = dataAccessor.getChangesources({
          order: '-changesourceid'
        })

        const ComponentClass = Vue.extend(ChangesList)

        /**
         * TODO: Make data module compatible with Vue, so that collections
         * can be directly passed to Vue SFC. Right now we are creating new arrays
         * for different properties (builds, builders, etc), and appending items
         * to them and passing it as data to the component.
         */
        let buildsArray = [],
          buildersArray = [],
          workersArray = [],
          changesArray = [],
          buildrequestsArray = [],
          buildsetsArray = [],
          changesourcesArray = []

        builds.onNew = build => {
          axios
            .get(
              `${window.location.origin}/api/v2/builds/${build.buildid}?property=*`
            )
            .then(response => {
              buildsArray.push(response.data.builds[0])
            })
          data.builds = buildsArray
        }
        builders.onNew = builder => {
          axios
            .get(
              `${window.location.origin}/api/v2/builders/${builder.builderid}`
            )
            .then(response => {
              buildersArray.push(response.data.builders[0])
            })
          data.builders = buildersArray
        }
        workers.onNew = worker => {
          axios
            .get(`${window.location.origin}/api/v2/workers/${worker.workerid}`)
            .then(response => {
              workersArray.push(response.data.workers[0])
            })
          data.workers = workersArray
        }
        changes.onNew = change => {
          axios
            .get(`${window.location.origin}/api/v2/changes/${change.changeid}`)
            .then(response => {
              changesArray.push(response.data.changes[0])
            })
          if (data.before) {
            data.rdate = new Date().getTime() / 1000
          }
          data.changes = changesArray
        }
        buildrequests.onNew = buildrequest => {
          axios
            .get(
              `${window.location.origin}/api/v2/buildrequests/${buildrequest.buildrequestid}`
            )
            .then(response => {
              buildrequestsArray.push(response.data.buildrequests[0])
            })
        }
        buildsets.onNew = buildset => {
          axios
            .get(`${window.location.origin}/api/v2/buildsets/${buildset.bsid}`)
            .then(response => {
              buildsetsArray.push(response.data.buildsets[0])
            })
        }
        changesources.onNew = changesource => {
          axios
            .get(
              `${window.location.origin}/api/v2/changesources/${changesource.changesourceid}`
            )
            .then(response => {
              changesourcesArray.push(response.data.changesources[0])
            })
        }

        let data = {
          location: $location,
          builders: [],
          builds: [],
          buildrequests: [],
          workers: [],
          buildsets: [],
          changes: [],
          changesources: [],
          before: true,
          rdate: new Date().getTime() / 1000
        }

        new ComponentClass({
          data: data,
          el: element.get(0)
        })

        data.scope = scope
      }

      return {
        link: link
      }
    }
  ])
