module Sources
  module Number
    class Demo < Sources::Number::Base

      def get(options = {})
        { :value => rand(100*2) - 100, :label => "demo label" }
      end

    end
  end
end