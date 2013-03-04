require "spec_helper"

describe Api::DatapointsTargetsController do
  describe "#index" do
    it "responds successfully using the selected plugin" do
      plugin = mock('mock')
      plugin.expects(:available_targets).returns(['test1', 'test2'])
      Sources.expects(:datapoints_plugin).with('demo').returns(plugin)
      get :index, :source => 'demo', :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      result.should == ['test1', 'test2']
    end
  end
end