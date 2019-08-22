import Vue from 'vue'
import PortsList from './components/PortsList.vue'

angular
  .module('buildbot_macports_custom_views')
  .config([
    'bbSettingsServiceProvider',
    bbSettingsServiceProvider => {
      bbSettingsServiceProvider.addSettingsGroup({
        name: 'PortsBuildsHistory',
        caption: 'Ports Builds History page related settings',
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
            default_value: 20000
          }
        ]
      })
    }
  ])
  .directive('portsDirective', [
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
      const settings = bbSettingsService.getSettingsGroup('PortsBuildsHistory')

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
        var workers = dataAccessor.getWorkers({
          order: '-workerid'
        })

        var ComponentClass = Vue.extend(PortsList)

        /* cannot pass the changes directly, as the magic of buildbot 
          data module clashes with the magic of vue observers */
        var data = {
          location: $location,
          builders: [],
          builds: [],
          workers: []
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
          data.workers = workers.slice()
          scope.$digest()
        }

        scope.onChange = () => update()
        $location.onChange = () => update()
        builders.onChange = () => update()
        builds.onChange = () => update()
        workers.onChange = () => update()
      }

      return {
        link: link
      }
    }
  ])
