module Sources
  module Ci
    class Base

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
        []
      end

      # Returns ruby hash:
      # * label                 optional label
      # * last_build_time       time of last build
      # * last_build_status     last finished build status
      #                         Integer value: 0 (success), 1 (failure), -1 (else)
      # * current_status        current status
      #                         Integer value: 1 (building), -1 (else)
      def get(options = {})
      end

    end
  end
end