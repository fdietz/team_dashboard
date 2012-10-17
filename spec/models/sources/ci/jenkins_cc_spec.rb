require "spec_helper"

describe Sources::Ci::JenkinsCc do

  before do
    @ci = Sources::Ci::JenkinsCc.new
    @server_url = "http://localhost"
    @project = "test-build"
  end

  describe "#get" do
    it "returns a hash" do
      time = Time.now
      input = { "Projects" => { "Project" => [{"name" => @project, "lastBuildTime" => time.iso8601, "lastBuildStatus" => "SUCCESS", "activity" => "SLEEPING" }]}}
      @ci.expects(:request_build_status).with(@server_url).returns(input)
      result = @ci.get(:fields => { :server_url => @server_url, :project => @project })
      result.should == {
        :label             => @project,
        :last_build_time   => time.iso8601.to_s,
        :last_build_status => 0,
        :current_status    => 0,
      }
    end
  end

  describe "#request_build_status" do
    it "calls HttpService" do
      ::HttpService.expects(:request).with("#{@server_url}/cc.xml", :ssl => {:verify => false})
      @ci.request_build_status(@server_url)
    end
  end

  describe "#current_status" do
    it "returns 0 for sleeping status" do
      @ci.current_status('sleeping').should == 0
    end

    it "returns 1 for building status" do
      @ci.current_status('building').should == 1
    end

    it "returns -1 otherwise" do
      @ci.current_status(nil).should == -1
    end
  end

end
