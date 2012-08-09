module Sources
  module Number
    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      # Returns ruby hash:
      #  * value (boolean) mandatory
      #  * label (string) optional
      def get(options = {})
      end

    end
  end
end