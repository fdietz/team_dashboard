module Sources
  module StatusTable
    class Pingdom < Sources::StatusTable::Base

      def available?
        cc(:plugins).pingdom?
      end

      def get(options = {})
        connection = SimplePingdomInterface.new.make_request
        build_json_response(connection.status_table)
      end

    end
  end
end
