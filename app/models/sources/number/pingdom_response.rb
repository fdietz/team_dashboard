module Sources
  module Number
    class PingdomResponse < Sources::Number::Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def fields
        [
          { :name => "user", :title => "User name", :mandatory => true },
          { :name => "password", :title => "Password", :mandatory => true },
          { :name => "key", :title => "Key", :mandatory => true},
          { :name => "check", :title => "Check Name", :mandatory => true}
        ]
      end

      def get(options = {})
        fields = options.fetch(:fields)
        connection = SimplePingdomInterface.new(fields.fetch(:user), fields.fetch(:password), fields.fetch(:key), fields.fetch(:check))
        { :value => connection.response_time }
      end

    end
  end
end