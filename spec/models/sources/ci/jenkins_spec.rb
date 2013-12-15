require "spec_helper"

describe Sources::Ci::Jenkins do

  let(:server_url) { "http://localhost" }
  let(:project) { "test-build" }
  let(:ci) { Sources::Ci::Jenkins.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "ci", :source => "jenkins", :settings => { :server_url => server_url, :project => project }) }

  describe "#get" do
    it "returns the result" do
      interface = JenkinsInterface.new
      interface.expects(:single_result).with(project).returns('result')
      ci.expects(:jenkins).with(server_url).returns(interface)
      ci.get(:widget_id => widget.id).should eq 'result'
    end
  end

end
