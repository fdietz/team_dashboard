require "spec_helper"

describe Api::DashboardsController do

  describe "#create" do
    it "should respond with json content" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => "name").to_json
      post :create, :format => :json
      @response.code.should eq("201")
      result = JSON.parse(@response.body)
      result['name'].should == "name"
      result['id'].should be
    end

    it "should create dashboard" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => "name").to_json
      post :create, :format => :json
      assert_response :created
      Dashboard.count.should == 1
    end

    it "should respond with json content on failure" do
      @request.env['RAW_POST_DATA'] = FactoryGirl.attributes_for(:dashboard, :name => nil).to_json
      post :create, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      result['name'].should == ["can't be blank"]
    end
  end

  describe "#show" do
    before do
      @dashboard = FactoryGirl.create(:dashboard, :name => 'name')
    end

    it "should respond with json content" do
      get :show, :id => @dashboard.id, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      assert_equal 'name', result['name']
      result['id'].should == @dashboard.id
    end
  end

  describe "#index" do
    before do
      @dashboard1 = FactoryGirl.create(:dashboard)
      @dashboard2 = FactoryGirl.create(:dashboard)
    end

    it "should respond with json content" do
      get :index, :format => :json
      assert_response :success
      result = JSON.parse(@response.body)
      result.size.should == 2
      result.first['id'].should == @dashboard1.id
      result.second['id'].should == @dashboard2.id
    end
  end

  describe "#update" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
    end

    it "should respond with status 200 on success" do
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      @response.code.should eq("200")
    end

    it "should update widget" do
      @dashboard.name = "new name"
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      @dashboard.reload.name.should == "new name"
    end

    it "should return dashboard json representation on success" do
      @dashboard.name = "new name"
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      JSON.parse(@response.body)["name"].should == "new name"
    end

    it "should return json error response on failure" do
      @dashboard.name = nil
      @request.env['RAW_POST_DATA'] = @dashboard.to_json
      post :update, :id => @dashboard.id, :format => :json
      assert_response :unprocessable_entity
      result = JSON.parse(@response.body)
      result['name'].should == ["can't be blank"]
    end
  end

  describe "#destroy" do
    before do
      @dashboard = FactoryGirl.create(:dashboard)
    end
    it "should respond with status 204 on success" do
      delete :destroy, :id => @dashboard.id, :format => :json
      @response.code.should eq("204")
    end

    it "should delete dashboard" do
      Dashboard.count.should == 1
      delete :destroy, :id => @dashboard.id, :format => :json
      @response.code.should eq("204")
      Dashboard.count.should == 0
    end
  end
end