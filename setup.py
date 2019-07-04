#!/usr/bin/env python

from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

try:
    from buildbot_pkg import setup_www_plugin
except ImportError:
    import sys
    print('Please install buildbot_pkg module in order to install that '
          'package, or use the pre-build .whl modules available on pypi',
          file=sys.stderr)
    sys.exit(1)

setup_www_plugin(
    name='buildbot-macports-custom-views',
    description='MacPorts Custom Views Plugin for Buildbot',
    long_description=long_description,
    long_description_content_type='text/markdown',
    version='0.0.3',
    author=u'Rajdeep Bharati',
    author_email=u'rajdeepbharati13@gmail.com',
    url='https://github.com/macports/buildbot-macports-custom-views',
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
