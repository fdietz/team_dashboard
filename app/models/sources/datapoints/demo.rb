module Sources
  module Datapoints
    class Demo < Sources::Datapoints::Base

      def supports_target_browsing?
        true
      end

      def get(options = {})
        from    = (options[:from]).to_i
        to      = (options[:to] || Time.now).to_i

        widget  = Widget.find(options.fetch(:widget_id))
        targets = targetsArray(widget.targets)
        source  = options[:source]

        datapoints = []
        targets.each do |target|
          datapoints << { :target => "demo.example1", :datapoints => ::DemoHelper.generate_datapoints(from, to) }
        end
        datapoints
      end

      def available_targets(options = {})
        pattern = options[:pattern] || ""
        limit = options[:limit] || 200

        targets = []
        targets << "demo.example1"
        targets << "demo.example2"
        targets
      end

    end
  end
end