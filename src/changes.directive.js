import Vue from 'vue'
import ChangesList from './components/ChangesList.vue'

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
        /* create an instance of the data accessor */
        var dataAccessor = dataService.open().closeOnDestroy(scope)
        console.log('dataccessor', dataAccessor)

        var builders = dataAccessor.getBuilders({
          limit: settings.builderLimit.value,
          order: '-builderid'
        })
        var builds = dataAccessor.getBuilds({
          limit: settings.buildLimit.value,
          order: '-started_at',
          property: '*'
        })
        var buildrequests = dataAccessor.getBuildrequests({
          limit: settings.buildrequestLimit.value,
          order: '-submitted_at'
        })
        var workers = dataAccessor.getWorkers({
          order: '-workerid'
        })
        var buildsets = dataAccessor.getBuildsets({
          limit: settings.buildsetLimit.value,
          order: '-submitted_at'
        })
        var changes = dataAccessor.getChanges({
          limit: settings.changeLimit.value,
          order: '-changeid'
        })
        var changesources = dataAccessor.getChangesources({
          order: '-changesourceid'
        })
        var sourcestamps = dataAccessor.getSourcestamps({
          order: '-ssid'
        })

        var ComponentClass = Vue.extend(ChangesList)

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
          data.scope = scope
          data.location = $location
          data.builders = builders.slice()
          data.builds = builds.slice()
          data.buildrequests = buildrequests.slice()
          data.workers = workers.slice()
          data.buildsets = buildsets.slice()
          data.changes = changes.slice()
          data.changesources = changesources.slice()
          data.sourcestamps = sourcestamps.slice()
          scope.$digest()
        }

        scope.onChange = () => update()
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
