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
      result = @graphite.get(:targets => @targets, :from => @from, :to => @to)
      result.should eq(input)
    end
  end

  describe "#available_targets" do
    it "searches for given pattern" do
      input = %w(adam ada zebra)
      @graphite.expects(:request_available_targets).returns(input)
      result = @graphite.available_targets(:pattern => "ada")
      result.size.should == 2
    end

    it "limits returned targets" do
      input = %w(adam ada zebra)
      @graphite.expects(:request_available_targets).returns(input)
      result = @graphite.available_targets(:pattern => "ada", :limit => 1)
      result.size.should == 1
    end
  end
end
