module HttpProxy
  extend self

  def request(url)
    uri = URI.parse(url)
    connection = Faraday.new(uri) do |conn|
      conn.use FaradayMiddleware::ParseJson,       content_type: 'application/json'
      conn.use FaradayMiddleware::FollowRedirects, limit: 3
      conn.use Faraday::Response::RaiseError      

      conn.request  :json
      conn.response :json, :content_type => /\bjson$/
      
      conn.basic_auth(uri.user, uri.password) if uri.user && uri.password
      
      conn.adapter Faraday.default_adapter
    end
    connection.get(url).body
  end
end
