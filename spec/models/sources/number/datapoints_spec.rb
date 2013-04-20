require "spec_helper"

describe Sources::Number::Datapoints do

  let(:source) { Sources::Number::Datapoints.new }
  let(:widget) {
    FactoryGirl.create(:widget, :kind => "number", :source => "datapoints", :targets => "test1;test2",
      :settings => { :datapoints_source => "demo", :aggregate_function => "average" })
  }
  let(:targets) { ['test1', 'test2'] }

  before do
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
    @options = {
      from: @from,
      to: @to,
      source: "demo",
      widget_id: widget.id,
    }
    @input = [
      { "target" => "test1", "datapoints" => [[1, 10],[2, 20]] },
      { "target" => "test2", "datapoints" => [[3, 30],[4, 40]] }
    ]
    Sources::Datapoints::Demo.any_instance.stubs(:get).with(@options).returns(@input)
  end

  describe "#get" do

    it "calls datapoints_source plugin to retrieve data" do
      Sources::Datapoints::Demo.any_instance.expects(:get).with(@options).returns(@input)
      source.get(:from => @from, :to => @to, :widget_id => widget.id)
    end

    context "aggregate_function is avarge" do
      it "calculates value" do
        result = source.get(:from => @from, :to => @to, :widget_id => widget.id)
        result.should == { value: 2 }
      end
    end

    context "aggregate_function is sum" do
      it "calculates value" do
        widget.settings[:aggregate_function] = "sum"
        widget.save

        result = source.get(:from => @from, :to => @to, :widget_id => widget.id)
        result.should == { value: 10 }
      end
    end
  end

  describe "#available_targets" do
    it "calls datapoints_source plugin" do
      input = ["test1", "test2", "test3"]
      Sources::Datapoints::Demo.any_instance.expects(:available_targets).with(widget_id: widget.id, pattern: "pattern", source: "demo").returns(input)
      source.available_targets(widget_id: widget.id, pattern: "pattern", source: "demo")
    end
  end

end
