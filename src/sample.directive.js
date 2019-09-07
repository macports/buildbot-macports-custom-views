import Vue from 'vue'
import SampleVueComponent from './components/SampleVueComponent.vue'

import axios from 'axios'

angular
  .module('buildbot_macports_custom_views')
  .config([
    'bbSettingsServiceProvider',
    bbSettingsServiceProvider => {
      bbSettingsServiceProvider.addSettingsGroup({
        name: 'SampleVueComponent',
        caption: 'SampleVueComponent page related settings',
        items: [
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
  .directive('sampleDirective', [
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
      const settings = bbSettingsService.getSettingsGroup('SampleVueComponent')

      function link(scope, element, attrs) {
        // create an instance of the data accessor
        const dataAccessor = dataService.open().closeOnDestroy(scope)

        const changes = dataAccessor.getChanges({
          limit: settings.changeLimit.value,
          order: '-changeid'
        })

        const ComponentClass = Vue.extend(SampleVueComponent)

        /**
         * TODO: Make data module compatible with Vue, so that collections
         * can be directly passed to Vue SFC. Right now we are creating new arrays
         * for different properties (builds, builders, etc), and appending items
         * to them and passing it as data to the component.
         */
        let changesArray = []

        changes.onNew = change => {
          axios
            .get(`${window.location.origin}/api/v2/changes/${change.changeid}`)
            .then(response => {
              changesArray.push(response.data.changes[0])
            })
          data.changes = changesArray
        }

        let data = {
          location: $location,
          changes: []
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
