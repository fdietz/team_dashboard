require "spec_helper"

describe Sources::Ci::Jenkins do

  before do
    @ci = Sources::Ci::Jenkins.new
    @server_url = "http://localhost"
    @project = "test-build"
  end

  describe "#get" do
    it "returns a hash" do
      time = Time.now
      input = { "fullDisplayName" => "name", "lastBuildTime" => time.iso8601, "result" => "SUCCESS", "building" => "SLEEPING" }
      @ci.expects(:request_build_status).with(@server_url, @project).returns(input)
      result = @ci.get(:fields => { :server_url => @server_url, :project => @project })
      result[:label].should == "name"
      result[:last_build_time] == time
      result[:last_build_status] == 0
      result[:current_status] == 0
    end
  end

  describe "#status" do
    it "returns 0 for sleeping status" do
      @ci.status("SUCCESS").should == 0
    end

    it "returns 1 for building status" do
      @ci.status("FAILURE").should == 1
    end

    it "returns -1 otherwise" do
      @ci.status("BLA").should == -1
    end
  end

  describe "#current_status" do
    it "returns 0 for sleeping status" do
      @ci.current_status(false).should == 0
    end

    it "returns 1 for building status" do
      @ci.current_status(true).should == 1
    end

    it "returns -1 otherwise" do
      @ci.current_status(nil).should == -1
    end
  end

end