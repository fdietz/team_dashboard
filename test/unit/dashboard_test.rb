require 'test_helper'

class DashboardTest < ActiveSupport::TestCase

  test "should initialize layout" do
    assert_equal [], FactoryGirl.build(:dashboard).layout
  end

  test "name attribute is mandatory" do
    assert !FactoryGirl.build(:dashboard, :name => nil).valid?
  end
end
