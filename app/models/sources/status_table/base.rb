module Sources
  module StatusTable
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

      def default_fields
        []
      end

      def custom_fields
        []
      end

      # Returns ruby hash:
      def get(options = {})
      end

    end
  end
end
