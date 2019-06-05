request = require('request')

function parseResponse(query, jsonContent) {
  let json2ts = require('json2ts')
  let interfaces = json2ts.convert(jsonContent)
  console.log(interfaces)
}

var server = 'nine.buildbot.net'

var queries = [
  'builds',
  'changes',
  'buildsets',
  'workers',
  'changesources',
  'masters',
  'sourcestamps',
  'schedulers',
  'forceschedulers'
]

queries.forEach(query => {
  var request = require('request')
  var limit = 2
  var url = 'http://' + server + '/api/v2/' + query + '?limit=' + limit
  var requestComplete = false
  request(url, function(error, response, body) {
    if (error != null) {
      console.log('error:', error)
    }
    if (response.statusCode != 200) {
      console.log('statusCode:', response && response.statusCode)
    }
    parseResponse(query, body)
    requestComplete = true
  })
})
