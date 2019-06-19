# buildbot-macports-custom-views

Custom views plugin for MacPorts Buildbot.

## Getting Started

### Set up buildbot environment

Set up a buildbot environment: http://docs.buildbot.net/latest/developer/quickstart.html

### Set up this plugin

Activate the python virtual environment created in the above step, then:

    git clone https://github.com/macports/buildbot-macports-custom-views
    cd buildbot-macports-custom-views
    npm install
    pip install -e .

To create a development server:

    npm run watch

Include it in the buildbot master.cfg:

```py
c['www']['plugins']['buildbot_macports_custom_views'] = {}
```
