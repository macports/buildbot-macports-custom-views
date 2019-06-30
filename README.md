# buildbot-macports-custom-views

Custom views plugin for MacPorts Buildbot.

## Getting Started

### Set up a buildbot environment

Install python37 & create a virtual environment:

    sudo port install python37
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -U pip

Install buildbot dependencies & create buildmaster:

    pip install 'buildbot[bundle]'
    buildbot create-master master
    mv master/master.cfg.sample master/master.cfg

### Set up this plugin

Activate the python virtual environment created in the above step, then:

    git clone https://github.com/macports/buildbot-macports-custom-views
    cd buildbot-macports-custom-views
    npm install
    pip install -e .

For a production build:

    npm run build

To run a development server:

    npm run watch

Include it in the buildbot master.cfg:

```py
c['www']['plugins']['buildbot_macports_custom_views'] = {}
```

### Or directly use the ports

    sudo port install buildbot-2 py-buildbot-macports-custom-views
    buildbot create-master master

### Start buildbot

    buildbot start
