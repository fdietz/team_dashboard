module Sources
  module DatapointsTargets
    class Demo < Sources::DatapointsTargets::Base
      def get(options = {})
        targets = []
        targets << "demo.example1"
        targets << "demo.example2"
        targets
      end
    end
  end
end