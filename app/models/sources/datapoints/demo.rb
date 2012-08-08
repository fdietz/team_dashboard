module Sources
  module Datapoints
    class Demo < Sources::Datapoints::Base

      def supports_target_browsing?
        true
      end
      
      def get(targets, from, to, options = {})
        to = to || Time.now.to_i
        datapoints = []
        targets.each do |target|
          datapoints << { :target => "demo.example1", :datapoints => ::DemoHelper.generate_datapoints(from, to) }
        end
        datapoints
      end

    end
  end
end