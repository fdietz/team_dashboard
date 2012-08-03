class NewRelicConnection

  NewRelicApi.api_key = "XXXX"

  def self.instance
    @instance ||= self.new
  end

  def account
    @account ||= NewRelicApi::Account.find(:first)
  end

  def application
    @application ||= account.applications.first
  end

  def threshold_value(name)
    @application.threshold_values.find { |tv| tv.name == name }
  end

end