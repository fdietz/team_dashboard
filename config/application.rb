require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "active_record/railtie"
require "sprockets/railtie"

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module TeamDashboard
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    config.generators do |g|
      g.orm :active_record
    end

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # change minification options to fix Angular.js dependency injection
    config.assets.js_compressor = Sprockets::LazyCompressor.new { Uglifier.new(:mangle => false) }

    config.graphite_url     = ENV['GRAPHITE_URL']
    config.ganglia_web_url  = ENV['GANGLIA_WEB_URL']
    config.ganglia_host     = ENV['GANGLIA_HOST']
    config.pingdom_username = ENV['PINGDOM_USERNAME']
    config.pingdom_password = ENV['PINGDOM_PASSWORD']
    config.sensu_events     = ENV['SENSU_EVENTS_URL']
    config.uptime_url       = ENV['UPTIME_URL']

    config.jira_url         = ENV['JIRA_URL']           # e.g. "http://your-jira-installation/rest/api/latest/search"
    config.jira_user        = ENV['JIRA_USER']
    config.jira_password    = ENV['JIRA_PASSWORD']
  end
end
