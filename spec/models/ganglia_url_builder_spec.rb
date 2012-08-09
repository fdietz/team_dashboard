require "spec_helper"

describe GangliaUrlBuilder do

  before do
    @url_builder = GangliaUrlBuilder.new("http://localhost:3000")
    @target = "hostname@cluster (metric)"
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#format" do
    it "formats timestamp" do
      @url_builder.format(1339705206).should eq("06/14/2012 22:20")
    end
  end

  describe "#datapoints_url" do
    it "contains json format param" do
      @url_builder.datapoints_url(@target, @from, @to).should match("json=1")
    end

    it "contains cluster param" do
      @url_builder.datapoints_url(@target, @from, @to).should match("c=cluster")
    end

    it "contains host param" do
      @url_builder.datapoints_url(@target, @from, @to).should match("h=hostname")
    end

    it "contains metric param" do
      @url_builder.datapoints_url(@target, @from, @to).should match("m=metric")
    end

    it "contains range param" do
      @url_builder.datapoints_url(@target, @from, @to).should match("r=day")
    end

    # TODO: use custom range when Ganglia issue is fixed: https://github.com/ganglia/ganglia-web/issues/121

    # it "contains custom range param" do
    #   @url_builder.datapoints_url(@target, @from, @to).should match("r=custom")
    # end

    # it "contains from param" do
    #   cs = "cs=#{CGI.escape(@url_builder.format(@from))}"
    #   @url_builder.datapoints_url(@target, @from, @to).should include(cs)
    # end

    # it "contains until param" do
    #   ce = "ce=#{CGI.escape(@url_builder.format(@to))}"
    #   @url_builder.datapoints_url(@target, @from, @to).should include(ce)
    # end
  end

  describe "#approximate_range_params" do
    it "returns hour for a range smaller then 2 hours" do
      @url_builder.approximate_range_params((Time.now-1.5.hours).to_i, Time.now.to_i).should == "r=hour"
    end

    it "returns 2hr for a range greater than 2 hours" do
      @url_builder.approximate_range_params((Time.now-2.5.hours).to_i, Time.now.to_i).should == "r=2hr"
    end

    it "returns 4hr for a range greater than 3 hours" do
      @url_builder.approximate_range_params((Time.now-3.5.hours).to_i, Time.now.to_i).should == "r=4hr"
    end

    it "returns day for a range greater than 1 day" do
      @url_builder.approximate_range_params((Time.now-1.day).to_i, Time.now.to_i).should == "r=day"
    end

    it "returns week for a range greater than 7 days" do
      @url_builder.approximate_range_params((Time.now-8.day).to_i, Time.now.to_i).should == "r=week"
    end

    it "returns month for a range greater than 30 days" do
      @url_builder.approximate_range_params((Time.now-31.day).to_i, Time.now.to_i).should == "r=month"
    end
  end

end