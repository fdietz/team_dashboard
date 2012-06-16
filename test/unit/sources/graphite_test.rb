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
      assert_equal input, @graphite.datapoints(['test1'], 1.day.ago)
    end

    test "should return latested datapoint at requested date range and ignore null datapoints" do
      datapoints = [[1,123], [10, 456], [3, 122]]
      input = [{ "target" => 'test1', "datapoints" => datapoints }]
      @graphite.expects(:request_datapoints).returns(input.to_json)
      assert_equal([{ "target" => 'test1', "datapoints" => [[10, 456]] }], @graphite.datapoints_at('test1', Time.now.to_i))
    end

    test "should return latest datapoint for multiple targets" do
      datapoints = [[1,123], [10, 456], [3, 122]]
      input = [{ "target" => 'test1', "datapoints" => datapoints }, { "target" => 'test2', "datapoints" => datapoints }]
      @graphite.expects(:request_datapoints).returns(input.to_json)
      assert_equal([{ "target" => 'test1', "datapoints" => [[10, 456]] }, { "target" => 'test2', "datapoints" => [[10, 456]] }], @graphite.datapoints_at('test1', Time.now.to_i))
    end
  end

  class GraphiteUrlBuilderTest < ActiveSupport::TestCase

    def setup
      @url_builder = Graphite::UrlBuilder.new("http://localhost:3000")
      @targets = ['test1', 'test2']
      @from = 1.day.ago.to_i
      @to = Time.now.to_i
    end

    test "should format timestamp" do
      assert_equal "22:20_20120614", @url_builder.format(1339705206)
    end

    test "should create target params" do
      assert_equal "target=test1&target=test2", @url_builder.target_params(@targets)
    end

    test "url contains json format param" do
      assert_match "format=json", @url_builder.datapoints_url(@targets, @from, @to)
    end

    test "url contains from param" do
      assert_match "from=#{@url_builder.format(@from)}", @url_builder.datapoints_url(@targets, @from, @to)
    end

    test "url contains until param" do
      assert_match "until=#{@url_builder.format(@to)}", @url_builder.datapoints_url(@targets, @from, @to)
    end

    test "url contains target params" do
      assert_match "target=test1&target=test2", @url_builder.datapoints_url(@targets, @from, @to)
    end
  end
end