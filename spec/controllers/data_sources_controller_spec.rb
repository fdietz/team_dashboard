require "spec_helper"

describe Api::DataSourcesController do
  describe "#index" do
    it "responds successfully using the selected plugin" do
      # plugin = mock('mock')
      # plugin.expects(:get).returns({ :value => true, :label => "demo" })

      Sources::Boolean::Demo.any_instance.expects(:get).returns({ :value => true, :label => "demo" })
      # Sources.expects(:plugin_clazz).with("boolean", "demo").returns(Sources::Boolean::Demo)

      # Sources.expects(:boolean_plugin).with('demo').returns(plugin)
      get :index, :kind => 'boolean', :source => 'demo', :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal({ "value" => true, "label" => "demo" }, result)
    end
  end
end