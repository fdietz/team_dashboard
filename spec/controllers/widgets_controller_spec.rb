require "spec_helper"

describe Api::WidgetsController do
  describe "#create" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
    end
    it "should respond with json content" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :name => "name", :dashboard => @dashboard).to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :created
      result = JSON.parse(@response.body)
      assert_equal "name", result['name']
      assert_equal @dashboard.id, result['dashboard_id']
      assert result['id']
    end

    it "should create widget" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :dashboard => @dashboard).to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :created
      Widget.count.should == 1
    end

    it "should respond with json content on failure" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget, :name => nil, :dashboard => @dashboard).to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

    it "should respond with json error message if dashboard not found" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget).to_json
      unknown_id = -1
      post :create, :dashboard_id => unknown_id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end

    it "handles settings attributes as single attribute with nested attributes on its own" do
      @request.env['RAW_POST_DATA'] = { :name => "name", :dashboard_id => @dashboard.id, :source1 => "a", :source2 => "b" }.to_json
      post :create, :dashboard_id => @dashboard.id, :format => :json
      assert_response :created
      result = JSON.parse(@response.body)
      assert_equal "a", result["source1"]
      assert_equal "b", result["source2"]
    end
  end

  describe "#show" do
    before do
      @widget = FactoryGirl.create(:widget, :name => 'name')
    end
    it "should respond with json content" do
      get :show, :dashboard_id => @widget.dashboard.id, :id => @widget.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'name', result['name']
      assert_equal @widget.dashboard.id, result['dashboard_id']
      assert_equal @widget.id, result['id']
    end
  end

  describe "#index" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
      @widget1 = FactoryGirl.create(:widget, :dashboard => @dashboard)
      @widget2 = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end
    it "should respond with json content" do
      get :index, :dashboard_id => @dashboard.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 2, result.size
      assert_equal @widget1.id, result.first['id']
      assert_equal @widget2.id, result.second['id']
    end
  end

  describe "#update" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
      @widget = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end
    it "should respond with status 204 on success" do
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response 204
    end

    it "should update widget" do
      @widget.name = "new name"
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_equal "new name", @widget.reload.name
    end

    it "should return json error response on failure" do
      @widget.name = nil
      @request.env['RAW_POST_DATA'] = @widget.to_json
      post :update, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert_equal ["can't be blank"], result['name']
    end

    it "should respond with json error message if dashboard not found" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:widget).to_json
      unknown_id = -1
      post :update, :dashboard_id => unknown_id, :id => @widget.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end
  end

  describe "#destroy" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
      @widget = FactoryGirl.create(:widget, :dashboard => @dashboard)
    end
    it "should respond with status 204 on success" do
      delete :destroy, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response 204
    end

    it "should delete widget" do
      Widget.count.should == 1
      delete :destroy, :dashboard_id => @dashboard.id, :id => @widget.id, :format => :json
      assert_response 204
      Widget.count.should == 0
    end

    it "should respond with json error message if dashboard not found" do
      unknown_id = -1
      delete :destroy, :dashboard_id => unknown_id, :id => @widget.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      assert result["message"]
    end
  end
end