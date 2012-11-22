require "spec_helper"

describe GraphiteUrlBuilder do

  before do
    @url_builder = GraphiteUrlBuilder.new("http://localhost:3000")
    @targets = ['test1', 'test2']
    @from = 1.day.ago.to_i
    @until = Time.now.to_i
  end

  describe "#format" do
    it "formats timestamp" do
      @url_builder.format(@from).should eq(Time.at(@from).strftime("%H:%M_%Y%m%d"))
    end
  end

  describe "#datapoints_url" do
    before do
      @params = @url_builder.datapoints_url(@targets, @from, @until)[:params]
    end

    it "contains json format param" do
      @params[:format].should == "json"
    end

    it "contains target param" do
      @params[:target].should == ["test1", "test2"]
    end

    it "contains from param" do
      @params[:from].should == @url_builder.format(@from)
    end

    it "contains until param" do
      @params[:until].should == @url_builder.format(@until)
    end
  end

end