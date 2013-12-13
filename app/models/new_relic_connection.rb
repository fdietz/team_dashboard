class NewRelicConnection

  attr_reader :api_key

  def initialize(api_key)
    @api_key = api_key
  end

  def self.instance(api_key)
    @instances ||= {}
    @instances[api_key] ||= self.new(api_key)
    @instances[api_key]
  end

  def account
    NewRelicApi.api_key = api_key
    @account ||= NewRelicApi::Account.find(:first)
  end

  def application
    @application ||= account.applications.first
  end

  def threshold_value(name)
    application.threshold_values.find { |tv| tv.name == name }
  end

end
