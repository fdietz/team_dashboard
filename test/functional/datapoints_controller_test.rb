require 'test_helper'

module Api

  class DatapointsControllerShowTest < ActionController::TestCase
    tests DatapointsController


    test "should respond to from and to param" do
      data_point = { :target => 'test', :datapoints => [[170, 1339315980], [10, 1339316040]]}
      handler = mock('mock')
      handler.stubs(:datapoints).returns([data_point])
      Sources.stubs(:handler).returns(handler)
      get :show, :targets => ['test'], :from => Time.now.to_i, :to => Time.now.to_i, :format => :json

      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'test', result.first['target']
      assert result.first['datapoints']
    end

    test "should respond to at params" do
      dp = [170, 1339315980]
      handler = mock('mock')
      handler.stubs(:datapoint).returns(dp)
      Sources.stubs(:handler).returns(handler)
      get :show, :targets => ['test'], :at => Time.now.to_i, :format => :json

      assert_response :success
      assert_equal dp, JSON.parse(@response.body)
    end

  end

end