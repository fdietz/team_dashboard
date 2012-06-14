require 'test_helper'

module Sources
  class SimpleMetricTest < ActiveSupport::TestCase

    test "should return metrics" do
      input = [::SimpleMetrics::Metric.new(:name => 'test1'), ::SimpleMetrics::Metric.new(:name => 'test2')]
      ::SimpleMetrics::MetricRepository.expects(:find_all).returns(input)
      assert_equal ['test1', 'test2'], SimpleMetrics.new.metrics
    end

    test "should return datapoints" do
    end
  end
end