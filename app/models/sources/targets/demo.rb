module Sources
  module Targets
    class Demo < Sources::Targets::Base
      def targets
        targets = []
        targets << "demo.example1"
        targets << "demo.example2"
        targets
      end
    end
  end
end