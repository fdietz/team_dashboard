require 'test_helper'

module Sources
  class GraphiteTest < ActiveSupport::TestCase

    def setup
      @graphite = Graphite.new(:graphite_url => "http://localhost:3000")
    end

    test "should return metrics" do
      input = ['test1', 'test2']
      @graphite.expects(:request_metrics).returns(input.to_json)
      assert_equal ['test1', 'test2'], @graphite.metrics
    end

    test "should return datapoints" do
      input = [{ "target" => 'test1', "datapoints" => [[1,123], [2, 456]]}]
      @graphite.expects(:request_datapoints).returns(input.to_json)
      assert_equal input, @graphite.datapoints('test1', 1.day.ago)
    end

    test "should format timestamp" do
      assert_equal "22:20_20120614", @graphite.format(1339705206)
    end
  end
end