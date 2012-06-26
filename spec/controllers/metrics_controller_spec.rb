require "spec_helper"

describe Api::MetricsController do
  describe "#index" do
    it "responds successfully using the selected plugin" do
      plugin = mock('mock')
      plugin.expects(:targets).returns(['test1', 'test2'])
      Sources.expects(:targets_plugin).with('demo').returns(plugin)
      get :index, :source => 'demo', :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      result.should == [{ 'name' => 'test1' }, {'name' => 'test2' }]
    end
  end
end