module Sources
  module Datapoints

    class Error < StandardError; end
    class NotFoundError < Error; end
    
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

      def get(targets, from, to, options = {})
      end
    end
  end
end