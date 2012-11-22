module Sources
  module Boolean

    class Pingdom < Sources::Number::Base

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
        { :value => connection.status }
      end

    end

  end
end