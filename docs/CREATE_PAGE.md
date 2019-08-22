# How to create a new page

Set up your development environment as described in [README](../README.md), then run `npm run watch`.

Open [src/sample.directive.js](../src/sample.directive.js). Change the name from `sample` to whatever name you want to provide your page. (We are assuming the name is `sample` for the sake of this example). The corresponding Vue SFC is [src/components/SampleVueComponent.vue](../src/components/SampleVueComponent.vue).

Now open [src/main.module.js](../src/main.module.js).

In the last line, import the sample directive as follows:
`require('./sample.directive.js')`

In the [pages variable](../src/main.module.js#L30), you will need to add information about the directive which you are adding. By default (for MacPorts use case there are three arrays inside pages).

Suppose you want to name the page `My Sample Component` (this is displayed on the navigation bar), with the route as `#/sample`.

Note that in [src/sample.directive.js#L47](../src/sample.directive.js#L47), the directive has been named in lower camelCase as `sampleDirective` (this is how it should be named).

So, in the `pages` variable, you need to append this array:

`['My Sample Component', '<sample-directive></sample-directive>', 'sample']`

Make sure the tags `<sample-directive>` are in lowercase, separated by `-`, and they have the same name as the directive.

If the directive was `mySampleDir`, then the tags should be `<my-sample-dir></my-sample-dir>`
