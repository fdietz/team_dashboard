require "spec_helper"

describe Widget do

  before do
    @dashboard = FactoryGirl.create(:dashboard)
  end

  describe "#add_to_dashboard_layout callback" do
    it "updates dashboard layout on widget creation" do
      widget = Widget.create!(:name => "name", :dashboard => @dashboard)
      @dashboard.reload.layout.should eq([widget.id])
    end 
  end

  describe "#remove_from_dashboard_layout callback" do
    it "updates dashboard layout on widget destroy" do
      widget = Widget.create!(:name => "name", :dashboard => @dashboard)
      widget.destroy
      @dashboard.reload.layout.should eq([])
    end
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
end