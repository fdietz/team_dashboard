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
    conn.response :logger if Rails.env.development?

    conn.use FaradayMiddleware::ParseJson,       :content_type => 'application/json'
    conn.use FaradayMiddleware::FollowRedirects, :limit => 3
    conn.use HttpService::RaiseError

    conn.adapter Faraday.default_adapter
  end

  # Initialize Faraday connection and execute request
  #
  # url     -  String or URI for request
  # options -  faraday request options
  #
  # URL params can be passed as part of the url or using a params hash
  # via options. Faraday will automaticall URL encode params.
  #
  # Array params will result in nested params: GET /foo?bar[]=baz&bar[]=qux
  # instead of GET /foo?bar=baz&bar=qux.
  # (see https://github.com/technoweenie/faraday/issues/78)
  #
  # Examples:
  #  * HttpService.request("http://localhost/test?key=value")
  #  * HttpService.request("http://localhost/test", :params => { :key => "value" })
  #
  def request(url, options = {})
    uri = url.is_a?(URI) ? url : URI.parse(url)
    connection = Faraday.new(uri, options, &(faraday_middleware || DEFAULT_MIDDLEWARE))
    connection.basic_auth(uri.user, uri.password) if uri.user && uri.password
    connection.get.body
  end

  # custom faraday middleware passes url along to simplify error reports
  class RaiseError < Faraday::Response::Middleware
    def on_complete(env)
      case env[:status]
      when 404
        raise Faraday::Error::ResourceNotFound, response_values(env)
      when 400...600
        raise Faraday::Error::ClientError, response_values(env)
      end
    end

    def response_values(env)
      url = env[:url];
      url = url.is_a?(URI) ? url.to_s : url
      {:url => url, :status => env[:status], :headers => env[:response_headers], :body => env[:body]}
    end
  end

end
