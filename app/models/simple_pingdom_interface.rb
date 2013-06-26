class SimplePingdomInterface

  attr_reader :user, :pass, :check, :app_key


  def initialize(user, pass, app_key, check)
    @user, @pass, @check, @app_key = user, pass, check, app_key
  end

  def pingdom_url
    @pingdom_url ||= "https://#{CGI.escape(user)}:#{pass}@api.pingdom.com/api/2.0/checks"
  end

  def response
    ::HttpService.request(pingdom_url, :headers => { 'App-Key' => '9ucbwe7se1uf61l59h2s0zm6ogjzpd7v'} )
  end

  def check_response
    response["checks"].find { |r| r["name"] == check } || raise(Sources::Booleans::NotFoundError("no response found for this check"))
  end

  def response_time
    check_response["lastresponsetime"].to_i
  end

  def status
    check_response["status"] == "up"
  end

end