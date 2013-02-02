module Sources
  module ExceptionTracker
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
      # * label                 name of application
      # * last_error_time       time of last error
      # * unresolved_errors     number of unresolved errors
      def get(options = {})
      end

    end
  end
end