module Sources
  module Number
    class Datapoints < Sources::Number::Base

      def get(options = {})
        widget             = Widget.find(options.fetch(:widget_id))
        datapoints_source  = widget.settings.fetch(:datapoints_source)
        aggregate_function = widget.settings.fetch(:aggregate_function)

        plugin = Sources.plugin_clazz('datapoints', datapoints_source).new
        result = plugin.get(options.merge(:source => datapoints_source))

        datapoints_for_all_targets = result.map { |r| r[:datapoints] }
        datapoints = datapoints_for_all_targets.inject([]) { |result, v| result += v; result }
        values = datapoints.map { |dp| dp.last }

        value = case aggregate_function
        when "average"
          values.inject(0, &:+) / values.size
        when "sum"
          values.inject(0, &:+)
        else
          raise "Unsupported aggregate function: #{aggregate_function}"
        end

        { value: value }
      end

    end
  end
end