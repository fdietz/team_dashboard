require 'complex_config/plugins/uri'

ComplexConfig::Provider.flush_cache.deep_freeze = !Rails.env.test? # allow modification during tests b/c of stubs etc.
