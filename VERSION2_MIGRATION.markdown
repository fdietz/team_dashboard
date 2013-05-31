# Migration Guide for Team Dashboard 2

Team Dashboard 2 has quite a different data model compared to version 1. It includes the following changes:
* `number`, `boolean`, `exception_tracker` and `ci` widget actually consisted of three widgets packaged as a single widget. Instead of a single widget, you will end up with 3 small widgets instead.
* `counter` widget obsoleted, use the `number` widget instead
* simplified attribute names for forms, for example `http_proxy_url` instead `http_proxy-http_proxy_url`

## Migrate using the Rake Task
You can get the new version with a single "git pull" since it is already available on master branch.

Additionally, there is a Rake Task provided to migrate your database.

First create the new db schema:

    bundle exec rake db:migrate

then convert your old configuration to the new version:

    bundle exec rake migrate_widgets