require 'test_helper'

module Api

  class CountersControllerShowTest < ActionController::TestCase
    tests NumbersController

    test "should respond successfully" do
      handler = mock('mock')
      handler.stubs(:datapoints_at).returns(180)
      Sources.stubs(:handler).returns(handler)
      get :show, :targets => ['test'], :aggregate_function => 'sum', :at => Time.now.to_i, :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal({ 'value' => 180}, result)
    end
  end

end