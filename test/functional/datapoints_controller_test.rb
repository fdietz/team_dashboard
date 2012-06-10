require 'test_helper'

module Api

  class DatapointsControllerShowTest < ActionController::TestCase
    tests DatapointsController

    test "should respond with json content" do
      data_point = { :target => 'test', :datapoints => [[170, 1339315980], [10, 1339316040]]}
      @controller.expects(:prepare_data_points).returns([data_point])
      get :show, :targets => ['test'], :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'test', result.first['name']
      assert result.first['data']
    end

  end

end