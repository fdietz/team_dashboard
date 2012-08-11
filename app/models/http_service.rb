# HttpService is used for all HTTP requests and is therefore the central place
# to configure your proxy and/or ssl configuration.
#
# We use the Faraday gem:
#   http://rubydoc.info/gems/faraday
#
# Proxy Settings:
#   Faraday will pick up the http_proxy environment variable automatically if set.
#
#   You can also set it here using the proxy options hash:
#     :proxy        - Hash of proxy options
#       :uri        - Proxy Server URI
#       :user       - Proxy server username
#       :password   - Proxy server password
#
#   Faraday.new(uri, :proxy => { :uri => "http://proxy" })
#
# SSL Configuration Documentation:
#   https://github.com/technoweenie/faraday/wiki/Setting-up-SSL-certificates
#
# Changing the Faraday adapter:
#   Create a config/initializer/faraday.rb file:
#     Faraday.default_adapter = :typhoeus
#
# Faraday default middleware changes:
#   Create set these explicitly in a config/initializer/faraday.rb file:
#     HttpService.faraday_middleware = Proc.new do |conn|
#       # your custom middleware here
#     end
#
module HttpService
  extend self

  class << self
    attr_accessor :faraday_middleware
  end

  DEFAULT_MIDDLEWARE = Proc.new do |conn|
    conn.request  :json

    conn.response :json, :content_type => /\bjson$/
    conn.response :xml,  :content_type => /\bxml$/

    conn.use FaradayMiddleware::ParseJson,       :content_type => 'application/json'
    conn.use FaradayMiddleware::FollowRedirects, :limit => 3
    conn.use Faraday::Response::RaiseError

    conn.adapter Faraday.default_adapter
  end

  def request(url, options = {})
    uri = URI.parse(url)
    connection = Faraday.new(uri, options, &(faraday_middleware || DEFAULT_MIDDLEWARE))
    connection.basic_auth(uri.user, uri.password) if uri.user && uri.password
    connection.get(url).body
  end
end
