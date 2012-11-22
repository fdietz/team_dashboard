require "spec_helper"

describe Widget do

  before do
    @dashboard = FactoryGirl.create(:dashboard)
  end

  describe "#set_defaults" do
    it "should initialize size" do
      FactoryGirl.build(:widget).size.should == 1
    end

    it "should initialize kind" do
      FactoryGirl.build(:widget).kind.should == "graph"
    end

    it "should initialize range" do
      FactoryGirl.build(:widget).range.should == "30-minutes"
    end

    it "name attribute is mandatory" do
      FactoryGirl.build(:widget, :name => nil).should_not be_valid
    end

    it "dashboard_id attribute is mandatory" do
      FactoryGirl.build(:widget, :dashboard_id => nil).should_not be_valid
    end
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