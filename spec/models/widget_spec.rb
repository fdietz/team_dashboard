require "spec_helper"

describe Widget do

  before do
    @dashboard = FactoryGirl.create(:dashboard)
  end

  describe "#settings" do
    describe "#as_json" do
      it "flattens settings attributes into widgets attributes" do
        widget = FactoryGirl.build(:widget, :name => "name", :settings => { :graph_type => "line" })
        result = widget.as_json
        result["name"].should == "name"
        result["graph_type"].should == "line"
      end
    end

    describe "#slice_attributes" do
      it "returns settings attributes as nested settings hash" do
        input = { :name => "name", :graph_type => "line" }
        result = Widget.slice_attributes(input)
        result[:name].should == "name"
        result[:settings][:graph_type].should == "line"
      end
    end
  end
end