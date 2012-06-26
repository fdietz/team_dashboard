require "spec_helper"

describe Dashboard do
  describe "#set_defaults" do
    it "should initialize layout" do
      FactoryGirl.build(:dashboard).layout.should eq([])
    end

    it "name attribute is mandatory" do
      FactoryGirl.build(:dashboard, :name => nil).should_not be_valid
    end
  end
end