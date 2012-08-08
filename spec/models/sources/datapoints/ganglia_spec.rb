require "spec_helper"

describe Sources::Datapoints::Ganglia do

  before do
    @graphite = Sources::Datapoints::Ganglia.new
    @targets = ['test1', 'test2']
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#get" do
    it "calls request_datapoints" do
      input = [[[1, 123]],[[1, 456]]]
      @graphite.expects(:request_datapoints).with(@targets, @from, @to).returns(input)
      result = @graphite.get(@targets, @from, @to)
      result.first["target"].should == "test1"
      result.first["datapoints"].should == [[1, 123]]
      result.last["target"].should == "test2"
      result.last["datapoints"].should == [[1, 456]]
    end
  end
end