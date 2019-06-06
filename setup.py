#!/usr/bin/env python

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

try:
    from buildbot_pkg import setup_www_plugin
except ImportError:
    import sys
    print("Please install buildbot_pkg module in order to install that package, or use the pre-build .whl modules available on pypi", file=sys.stderr)
    sys.exit(1)

setup_www_plugin(
    name='buildbot-macports-custom-views',
    description='MacPorts Custom Views Plugin for Buildbot',
    author=u'Rajdeep Bharati',
    author_email=u'rajdeepbharati13@gmail.com',
    url='https://buildbot.net/',
    packages=['buildbot_macports_custom_views'],
    package_data={
        '': [
            'VERSION',
            'static/*'
        ]
    },
    entry_points="""
        [buildbot.www]
        buildbot_macports_custom_views = buildbot_macports_custom_views:ep
    """,
    classifiers=[
        'License :: OSI Approved :: MIT License'
    ],
)
