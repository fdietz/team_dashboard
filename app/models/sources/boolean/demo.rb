module Sources
  module Boolean
    class Demo < Sources::Boolean::Base
      def get(options = {})
        { :value => rand(2) == 1, :label => "demo label" }
      end
    end
  end
end