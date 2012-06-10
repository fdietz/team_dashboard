ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/autorun'

class ActionController::TestCase
  teardown :teardown_raw_post_data

  def teardown_raw_post_data
    @request.env.delete('RAW_POST_DATA')
  end

end

