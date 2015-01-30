class NewRelicConnection

  attr_reader :api_key, :app_name

  def initialize(api_key, app_name = nil)
    @api_key = api_key
    @app_name = app_name
  end

  def self.instance(api_key)
    @instances ||= {}
    @instances[api_key] ||= self.new(api_key)
    @instances[api_key]
  end

  def available?
    BackendSettings.secrets.new_relic_api_key.present?
  end

  def account
    NewRelicApi.api_key = api_key
    @account ||= NewRelicApi::Account.find(:first)
  end

  def application
    @application ||= if app_name.present?
                       account.applications.find do |app|
                         app.name == 'betterplace.org'
                       end
                     else
                       account.applications.first
                     end
  end

  def threshold_value(name)
    application.threshold_values.find { |tv| tv.name == name }
  end

end
