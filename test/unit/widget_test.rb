require 'test_helper'

class WidgetTest < ActiveSupport::TestCase
  
  def setup
    @dashboard = FactoryGirl.create(:dashboard)
  end

  test "should update dashboard layout on widget creation" do
    widget = Widget.create!(:name => "name", :dashboard => @dashboard)
    assert_equal [widget.id], @dashboard.reload.layout
  end 

  test "should update dashboard layout on widget destroy" do
    widget = Widget.create!(:name => "name", :dashboard => @dashboard)
    widget.destroy
    assert_equal [], @dashboard.reload.layout
  end

  test "should initialize size" do
    assert_equal 1, FactoryGirl.build(:widget).size
  end

  test "should initialize kind" do
    assert_equal "graph", FactoryGirl.build(:widget).kind
  end

  test "should initialize time" do
    assert_equal "hour", FactoryGirl.build(:widget).time
  end

  test "name attribute is mandatory" do
    assert !FactoryGirl.build(:widget, :name => nil).valid?
  end

  test "dashboard_id attribute is mandatory" do
    assert !FactoryGirl.build(:widget, :dashboard_id => nil).valid?
  end
end
