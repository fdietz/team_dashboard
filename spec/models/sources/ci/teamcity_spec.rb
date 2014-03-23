require "spec_helper"

describe Sources::Ci::Teamcity do

  let(:tc_server_url) { "http://localhost" }
  let(:tc_project) { "test-build" }
  let(:ci) { Sources::Ci::Teamcity.new }

  describe "#get" do
    it "returns a hash with last_build_status filled" do
      widget = Widget.new
      widget.settings = { :server_url => tc_server_url, :project => tc_project }
      Widget.expects(:find).returns(widget)

      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.expects(:request_build_status).with(tc_server_url, tc_project).returns(buildStatusResponse)

      result = ci.get({:widget_id => "0815"})
      result.should == {
          :last_build_time   => nil,
          :last_build_status => 0,
          :current_status    => -1,
      }
    end
  end

  describe "#request_build_status" do
    it "calls TeamCity for builds of the specified project" do
      ::HttpService.expects(:request).with("#{tc_server_url}/guestAuth/app/rest/builds?locator=project:id:#{tc_project}")
      ci.request_build_status(tc_server_url, tc_project)
    end
  end

  describe "#aggregated_build_status" do
    it "considers builds of subprojects" do
      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.aggregated_build_status_from(buildStatusResponse).should == 1
    end
    it "considers only newest build of a build config (see http://youtrack.jetbrains.com/issue/TW-35157)" do
      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.aggregated_build_status_from(buildStatusResponse).should == 1
    end
    it "returns 0 when the newest build of each build config is SUCCESSful" do
      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.aggregated_build_status_from(buildStatusResponse).should == 0
    end
    it "returns 1 when one of the newest builds is FAILURE" do
      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.aggregated_build_status_from(buildStatusResponse).should == 1
    end
    it "returns 1 when one of the newest builds is ERROR" do
      buildStatusResponse = {"builds"=>{"build"=>[{"id"=>"4", "buildTypeId"=>"peeone_sub_build", "number"=>"3", "status"=>"ERROR", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:4", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=4&buildTypeId=peeone_sub_build"}, {"id"=>"3", "buildTypeId"=>"peeone_sub_build", "number"=>"2", "status"=>"FAILURE", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:3", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=3&buildTypeId=peeone_sub_build"}, {"id"=>"2", "buildTypeId"=>"peeone_sub_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:2", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=2&buildTypeId=peeone_sub_build"}, {"id"=>"1", "buildTypeId"=>"peeone_build", "number"=>"1", "status"=>"SUCCESS", "state"=>"finished", "href"=>"/guestAuth/app/rest/builds/id:1", "webUrl"=>"http://localhost:8111/viewLog.html?buildId=1&buildTypeId=peeone_build"}], "count"=>"4", "href"=>"/guestAuth/app/rest/builds?locator=project%3Aid%3Apeeone"}}
      ci.aggregated_build_status_from(buildStatusResponse).should == 1
    end
  end
end



