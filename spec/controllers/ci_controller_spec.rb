require "spec_helper"

describe Api::CiController do
  describe "#show" do
    it "responds successfully using the selected plugin" do
      plugin = mock('mock')
      plugin.expects(:get).returns({ :last_build_status => true, :label => "demo" })
      Sources.expects(:ci_plugin).with('demo').returns(plugin)
      get :show, :source => 'demo', :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal({ "last_build_status" => true, "label" => "demo" }, result)
    end

  end
end