require "spec_helper"

describe Api::CountersController do
  describe "#show" do
    it "responds correctly" do
      data_point = { :target => 'test', :datapoints => [[170, 1339315980], [10, 1339316040]]}
      plugin = mock('mock')
      plugin.expects(:get).returns([data_point])
      Sources.expects(:datapoints_plugin).with('demo').returns(plugin)
      get :show, :source => 'demo', :targets => ['test'], :from => Time.now.to_i, :to => Time.now.to_i, :aggregate_function => :sum, :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      result['value'].should == 180
    end
  end
end