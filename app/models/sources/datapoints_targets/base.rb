module Sources
  module DatapointsTargets
    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def get(options = {})
      end
    end
  end
end