console.log('Hello from the buildbot-macports-custom-views!')

var module = angular.module('buildbot_macports_custom_views', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.popover',
  'ngAnimate',
  'guanlecoja.ui',
  'bbData'
])

module
  .config([
    '$stateProvider',
    'glMenuServiceProvider',
    'bbSettingsServiceProvider',
    'config',
    (
      $stateProvider,
      glMenuServiceProvider,
      bbSettingsServiceProvider,
      config
    ) => {
      // Config object coming in from the master.cfg
      // console.log('config', config)

      let group
      const groups = []

      for (let i of [
        ['Changes', '<changes-directive></changes-directive>', 'changes'],
        [
          'Filter Builds',
          '<filter-builds-directive></filter-builds-directive>',
          'filterbuilds'
        ],
        ['Ports Build History', '<ports-directive></ports-directive>', 'ports']
      ]) {
        group = {
          name: i[0],
          template: i[1],
          url: i[2],
          items: []
        }
        groups.push(group)

        const groupForProvider = {
          name: group.name,
          caption: group.name,
          icon: group.name,
          order: group.name.length
        }
        glMenuServiceProvider.addGroup(groupForProvider)
      }

      for (group of Array.from(groups)) {
        const state = {
          template: group.template,
          name: group.name,
          url: `/${group.url}?id`,
          data: {
            group: group.name,
            caption: group.name
          }
        }

        $stateProvider.state(state)
      }

      bbSettingsServiceProvider.addSettingsGroup({
        name: 'BuildbotMacPortsCustomViews',
        caption: 'MacPorts Custom Views related settings',
        items: [
          {
            type: 'integer',
            name: 'buildLimit',
            caption: 'Number of builds to fetch',
            default_value: 200
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
  .config([
    '$locationProvider',
    function($locationProvider) {
      $locationProvider.hashPrefix('')
    }
  ])

module.run([
  '$rootScope',
  '$location',
  function($rootScope, $location) {
    $rootScope.location = $location
  }
])

require('./changes.directive.js')
require('./filter_builds.directive.js')
require('./ports.directive.js')
