// This is generated from Buildbot's JSON data using json2ts
// (the GenerateTypings.ts script in the scripts directory is a wrapper for json2ts which requests
//  a bunch of buildbot JSON API url's and calls json2ts on them to output Typescript interface
//  definitions)

export interface Property { }

export interface Build {
    builderid: number
    buildid: number
    buildrequestid: number
    complete: boolean
    complete_at: number
    masterid: number
    number: number
    properties: Property
    results: number
    started_at: number
    state_string: string
    workerid: number
}

export interface Field {
    default: string
    fullName: string
    hide: boolean
    label: string
    maxsize?: any
    multiple: boolean
    name: string
    need_email: boolean
    regex?: any
    required: boolean
    size: number
    tablabel: string
    type: string
}

export interface All_field {
    columns: number
    default: string
    fields: Field[]
    fullName?: any
    hide: boolean
    label: string
    layout: string
    maxsize?: any
    multiple: boolean
    name: string
    regex?: any
    required: boolean
    tablabel: string
    type: string
}

export interface Forcescheduler {
    all_fields: All_field[]
    builder_names: string[]
    button_name: string
    enabled: boolean
    label: string
    name: string
}

export interface Configured_on {
    builderid: number
    masterid: number
}

export interface Workerinfo {
    access_uri?: any
    admin?: any
    host?: any
    version: string
}

export interface Worker {
    configured_on: Configured_on[]
    connected_to: any[]
    graceful: boolean
    name: string
    paused: boolean
    workerid: number
    workerinfo: Workerinfo
}

export interface Master {
    active: boolean
    last_active: number
    masterid: number
    name: string
}

export interface Sourcestamp {
    branch: string
    codebase: string
    created_at: number
    patch?: any
    project: string
    repository: string
    revision: string
    ssid: number
}

export interface Buildset {
    bsid: number
    complete: boolean
    complete_at: number
    external_idstring?: any
    parent_buildid?: any
    parent_relationship?: any
    reason: string
    results: number
    sourcestamps: Sourcestamp[]
    submitted_at: number
}

export interface Scheduler {
    enabled: boolean
    master: Master
    name: string
    schedulerid: number
}

export interface Property {
    event: string[]
    github_distinct: any[]
}

export interface Change {
    author: string
    branch: string
    category?: any
    changeid: number
    codebase: string
    comments: string
    files: string[]
    parent_changeids: number[]
    project: string
    properties: Property
    repository: string
    revision: string
    revlink: string
    sourcestamp: Sourcestamp
    when_timestamp: number
}
