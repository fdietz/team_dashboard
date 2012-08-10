require "spec_helper"

describe Sources::Datapoints::Graphite do

  before do
    @graphite = Sources::Datapoints::Graphite.new
    @targets = ['test1', 'test2']
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#get" do
    it "calls request_datapoints" do
      input = [{ 'target' => 'test1', 'datapoints' => [[1, 123]] }]
      @graphite.expects(:request_datapoints).with(@targets, @from, @to).returns(input)
      result = @graphite.get(@targets, @from, @to)
      result.should eq(input)
    end
  end
end
