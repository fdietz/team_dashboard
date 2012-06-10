require 'test_helper'

module Api

  class DashboardsControllerCreateTest < ActionController::TestCase
    tests DashboardsController

    def setup
    end

    test "should respond with json content" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => "name").to_json
      post :create, :format => :json
      assert_response :created
      result = JSON.parse(@response.body)
      assert_equal "name", result['name']
      assert result['id']
    end

    test "should create dashboard" do
      assert_difference("Dashboard.count") do
        @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => "name").to_json
        post :create, :format => :json
        assert_response :created
      end
    end

    test "should respond with json content on failure" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => nil).to_json
      post :create, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

  end 

  class DashboardsControllerShowTest < ActionController::TestCase
    tests DashboardsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard, :name => 'name')
    end

    test "should respond with json content" do
      get :show, :id => @dashboard.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'name', result['name']
      assert_equal @dashboard.id, result['id']
    end
  end

  class DashboardsControllerIndexTest < ActionController::TestCase
    tests DashboardsController

    def setup
      @dashboard1 = FactoryGirl.create(:dashboard)
      @dashboard2 = FactoryGirl.create(:dashboard)
    end

    test "should respond with json content" do
      get :index, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 2, result.size
      assert_equal @dashboard1.id, result.first['id']
      assert_equal @dashboard2.id, result.second['id']
    end
  end 

  class DashboardsControllerUpdateTest < ActionController::TestCase
    tests DashboardsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
    end

    test "should respond with status 204 on success" do
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      assert_response 204
    end

    test "should update widget" do
      @dashboard.name = "new name"
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      assert_equal "new name", @dashboard.reload.name
    end

    test "should return json error response on failure" do
      @dashboard.name = nil
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

  end 

  class DashboardsControllerDestroyTest < ActionController::TestCase
    tests DashboardsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
    end

    test "should respond with status 204 on success" do
      delete :destroy, :id => @dashboard.id, :format => :json
      assert_response 204
    end

    test "should delete dashboard" do
      assert_difference("Dashboard.count", -1) do
        delete :destroy, :id => @dashboard.id, :format => :json
        assert_response 204
      end
    end

  end
end