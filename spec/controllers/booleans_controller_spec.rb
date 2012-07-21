require "spec_helper"

describe Api::BooleansController do
  describe "#show" do
    it "responds successfully using the selected plugin" do
      plugin = mock('mock')
      plugin.expects(:get).returns({ :value => true, :label => "demo" })
      Sources.expects(:boolean_plugin).with('demo').returns(plugin)
      get :show, :source => 'demo', :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal({ "value" => true, "label" => "demo" }, result)
    end

  end
end