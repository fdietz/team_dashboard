module Sources
  module Boolean

    class Pingdom < Sources::Number::Base

      def get(options = {})
        user,pass,key,check = options.fetch(:http_proxy_url).split(':')
        client = ::Pingdom::Client.new :key => key, :username => user, :password => pass
        check = client.checks.find { |c| c.name == check }
        { :value => (check.status == 'up') }
      end

    end

  end
end