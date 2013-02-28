module Sources
  module Number

    # Gives you the "basic" new relic stats as numbers. All mushed into one file so that it
    # makes a standalone plugin for the dashboard
    #
    # Valid Names are
    #
    # * Apdex
    # * Response Time
    # * Throughput
    # * Memory
    # * CPU
    # * DB
    #
    class NewRelic < Sources::Number::Base

      # Internal class for the connection
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
          { :name => "api_key", :title => "Api Key", :mandatory => true },
          { :name => "value_name", :title => "Value Name", :mandatory => true },
        ]
      end

      def get(options = {})
        api_key = options.fetch(:fields).fetch(:api_key)
        value_name = options.fetch(:fields).fetch(:value_name)
        { :value => NewRelicConnection.instance(api_key).threshold_value(value_name).metric_value }
      end

      private

      def resolve_value(document, value_path)
        paths = value_path.split(".");
        current_element = document
        paths.each do |path|
          current_element = current_element[path]
        end
        current_element
      end

    end
  end
end