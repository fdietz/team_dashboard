require 'test_helper'

module Api

  class WidgetsControllerCreateTest < ActionController::TestCase
    tests WidgetsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
    end

    test "should respond with json content" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :name => "name", :dashboard => @dashboard).to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :created
      result = JSON.parse(@response.body)
      assert_equal "name", result['name']
      assert_equal @dashboard.id, result['dashboard_id']
      assert result['id']
    end

    test "should create widget" do
      assert_difference("Widget.count") do
        @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :dashboard => @dashboard).to_json
        post :create, :dashboard_id => @dashboard.id, :format => :json
        assert_response :created
      end
    end

    test "should respond with json content on failure" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :name => nil, :dashboard => @dashboard).to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

    test "should respond with json error message if dashboard not found" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget).to_json
      post :create, :dashboard_id => nil, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end
  end 

  class WidgetsControllerShowTest < ActionController::TestCase
    tests WidgetsController

    def setup
      @widget = FactoryGirl.create(:widget, :name => 'name')
    end

    test "should respond with json content" do
      get :show, :dashboard_id => @widget.dashboard.id, :id => @widget.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'name', result['name']
      assert_equal @widget.dashboard.id, result['dashboard_id']
      assert_equal @widget.id, result['id']
    end
  end

  class WidgetsControllerIndexTest < ActionController::TestCase
    tests WidgetsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
      @widget1 = FactoryGirl.create(:widget, :dashboard => @dashboard)
      @widget2 = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end

    test "should respond with json content" do
      get :index, :dashboard_id => @dashboard.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 2, result.size
      assert_equal @widget1.id, result.first['id']
      assert_equal @widget2.id, result.second['id']
    end
  end 

  class WidgetsControllerUpdateTest < ActionController::TestCase
    tests WidgetsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
      @widget = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end

    test "should respond with status 204 on success" do
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response 204
    end

    test "should update widget" do
      @widget.name = "new name"
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_equal "new name", @widget.reload.name
    end

    test "should return json error response on failure" do
      @widget.name = nil
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

    test "should respond with json error message if dashboard not found" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget).to_json
      post :update, :dashboard_id => nil, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end
  end 

  class WidgetsControllerDestroyTest < ActionController::TestCase
    tests WidgetsController

    def setup
      @dashboard = FactoryGirl.create(:dashboard)
      @widget = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end

    test "should respond with status 204 on success" do
      delete :destroy, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response 204
    end

    test "should delete widget" do
      assert_difference("Widget.count", -1) do
        delete :destroy, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
        assert_response 204
      end
    end

    test "should respond with json error message if dashboard not found" do
      delete :destroy, :dashboard_id => nil, :id => @widget.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end
  end
end