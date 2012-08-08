module Sources
  module Targets
    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def targets
      end
    end
  end
end