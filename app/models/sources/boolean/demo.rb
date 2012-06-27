module Sources
  module Boolean
    class Demo < Sources::Boolean::Base
      def get
        rand(2) == 1
      end
    end
  end
end