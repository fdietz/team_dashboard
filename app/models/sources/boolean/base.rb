module Sources
  module Boolean
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
      #  * value (boolean) mandatory
      #  * label (string) optional
      def get(options = {})
      end
    end
  end
end