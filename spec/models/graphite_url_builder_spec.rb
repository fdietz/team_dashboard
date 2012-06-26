require "spec_helper"

describe GraphiteUrlBuilder do

  before do
    @url_builder = GraphiteUrlBuilder.new("http://localhost:3000")
    @targets = ['test1', 'test2']
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#format" do
    it "formats timestamp" do
      @url_builder.format(1339705206).should eq("22:20_20120614")
    end
  end

  describe "#datapoints_url" do
    it "contains json format param" do
      @url_builder.datapoints_url(@targets, @from, @to).should match("format=json")
    end

    it "contains target param" do
      @url_builder.datapoints_url(@targets, @from, @to).should match("target=test1&target=test2")
    end

    it "contains from param" do
      @url_builder.datapoints_url(@targets, @from, @to).should match("from=#{@url_builder.format(@from)}")
    end

    it "contains until param" do
      @url_builder.datapoints_url(@targets, @from, @to).should match("until=#{@url_builder.format(@to)}")
    end
  end

end