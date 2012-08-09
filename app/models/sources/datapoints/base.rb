module Sources
  module Datapoints
    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def get(targets, from, to, options = {})
      end
    end
  end
end