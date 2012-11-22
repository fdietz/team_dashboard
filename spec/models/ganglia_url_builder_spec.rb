require "spec_helper"

describe GangliaUrlBuilder do

  before do
    @url_builder = GangliaUrlBuilder.new("http://localhost:3000")
    @target = "hostname@cluster(metric)"
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#format" do
    it "formats timestamp" do
      @url_builder.format(@from).should eq(Time.at(@from).strftime("%m/%d/%Y %H:%M"))
    end
  end

  describe "#datapoints_url" do
    before do
      @params = @url_builder.datapoints_url(@target, @from, @to)[:params]
    end

    it "contains json params" do
      @params[:json].should == 1
    end

    it "contains cluster param" do
      @params[:c].should == "cluster"
    end

    it "contains host param" do
      @params[:h].should == "hostname"
    end

    it "contains metric param" do
      @params[:m].should == "metric"
    end

    it "contains custom range param" do
      @params[:r].should == "custom"
    end

    it "contains from param" do
      @params[:cs].should == @url_builder.format(@from)
    end

    it "contains to param" do
      @params[:ce].should == @url_builder.format(@to)
    end
  end

end