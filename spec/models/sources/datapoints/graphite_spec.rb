require "spec_helper"

describe Sources::Datapoints::Graphite do

  let(:source) { Sources::Datapoints::Graphite.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "datapoints", :source => "graphite", :targets => "test1;test2", :settings => {}) }
  let(:targets) { ['test1', 'test2'] }

  before do
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#get" do
    it "calls request_datapoints" do
      input = [{ 'target' => 'test1', 'datapoints' => [[1, 123]] }]
      source.expects(:request_datapoints).with(targets, @from, @to).returns(input)
      result = source.get(:from => @from, :to => @to, :widget_id => widget.id)
      result.should eq(input)
    end
  end

  describe "#available_targets" do
    it "searches for given pattern" do
      input = %w(adam ada zebra)
      source.expects(:request_available_targets).returns(input)
      result = source.available_targets(:pattern => "ada")
      result.size.should == 2
    end

    it "limits returned targets" do
      input = %w(adam ada zebra)
      source.expects(:request_available_targets).returns(input)
      result = source.available_targets(:pattern => "ada", :limit => 1)
      result.size.should == 1
    end
  end
end
