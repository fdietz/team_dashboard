require 'faraday'
require 'faraday_middleware'

module HttpProxy
  extend self

  def request(url)
    uri = URI.parse(url)
    connection = Faraday.new(url: "#{uri.scheme}://#{uri.host}:#{uri.port}") do |conn|
      conn.request :json
      conn.response :json, :content_type => /\bjson$/
      conn.basic_auth(uri.user, uri.password) if uri.user or uri.password
      conn.adapter Faraday.default_adapter
    end
    connection.get("#{uri.path}?#{uri.query}").body
  rescue => e
    Rails.logger.error "Error while parsing JSON response: #{e}"
    nil
  end
end
