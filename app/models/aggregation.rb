module Aggregation
  extend self

  def aggregated_result(result, aggregate_function)
    dps = []
    result.each { |r| dps += r.with_indifferent_access[:datapoints] }
    aggregated_result = aggregate(dps, aggregate_function)
  end

  def aggregate(dps, aggregate_function)
    case aggregate_function.to_sym
    when :average
      sum = dps.inject(0) { |result, dp| result += dp.first if dp.first; result }
      sum / dps.size
    when :sum
      dps.inject(0) { |result, dp| result += dp.first if dp.first; result }
    when :delta
      dps.last.first - dps.first.first
    else
      raise ArgumentError, "Unknown aggregate function: #{aggregate_function}"
    end
  end

end