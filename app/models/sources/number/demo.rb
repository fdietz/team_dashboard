module Sources
  module Number
    class Demo < Sources::Number::Base

      def initialize
      end

      def get
        rand(100*2) - 100
      end

    end
  end
end