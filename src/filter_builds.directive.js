import Vue from 'vue'
import FilterBuilds from './components/FilterBuilds.vue'

angular
  .module('buildbot_macports_custom_views')
  .directive('filterBuildsDirective', [
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
      const settings = bbSettingsService.getSettingsGroup(
        'BuildbotMacPortsCustomViews'
      )

      function link(scope, element, attrs) {
        /* create an instance of the data accessor */
        var dataAccessor = dataService.open().closeOnDestroy(scope)
        console.log('dataccessor', dataAccessor)

        var builders = dataAccessor.getBuilders({
          order: '-builderid'
        })
        var builds = dataAccessor.getBuilds({
          limit: settings.buildLimit.value,
          order: '-started_at',
          property: '*'
        })
        var buildrequests = dataAccessor.getBuildrequests({
          limit: settings.buildLimit.value,
          order: '-submitted_at'
        })
        var workers = dataAccessor.getWorkers({
          order: '-workerid'
        })
        var buildsets = dataAccessor.getBuildsets({
          limit: settings.buildLimit.value,
          order: '-submitted_at'
        })
        var changes = dataAccessor.getChanges({
          limit: settings.changeLimit.value,
          order: '-changeid'
        })
        var changesources = dataAccessor.getChangesources({
          limit: 50,
          order: '-changesourceid'
        })
        var sourcestamps = dataAccessor.getSourcestamps({
          limit: 50,
          order: '-ssid'
        })

        var ComponentClass = Vue.extend(FilterBuilds)

        /* cannot pass the changes directly, as the magic of buildbot 
          data module clashes with the magic of vue observers */
        var data = {
          location: $location,
          builders: [],
          builds: [],
          buildrequests: [],
          workers: [],
          buildsets: [],
          changes: [],
          changesources: [],
          sourcestamps: []
        }

        var e = new ComponentClass({
          data: data,
          el: element.get(0)
        })

        function update() {
          data.location = $location
          data.builders = builders.slice()
          data.builds = builds.slice()
          data.buildrequests = buildrequests.slice()
          data.workers = workers.slice()
          data.buildsets = buildsets.slice()
          data.changes = changes.slice()
          data.changesources = changesources.slice()
          data.sourcestamps = sourcestamps.slice()
        }

        $location.onChange = () => update()
        builders.onChange = () => update()
        builds.onChange = () => update()
        buildrequests.onChange = () => update()
        workers.onChange = () => update()
        buildsets.onChange = () => update()
        changes.onChange = () => update()
        changesources.onChange = () => update()
        sourcestamps.onChange = () => update()
      }

      return {
        link: link
      }
    }
  ])
