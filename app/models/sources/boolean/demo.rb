module Sources
  module Boolean
    class Demo < Sources::Boolean::Base
      def get(options = {})
        { :value => rand(2) == 1 }
      end
    end
  end
end