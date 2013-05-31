module Sources
  module Alert
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
      #  * value (green,orange,red,blue) mandatory
      #  * label (alert string) mandatory
      def get(options = {})
      end
      
    end
  end
end