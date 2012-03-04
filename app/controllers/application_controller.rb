class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :load_targets, :load_bookmarks

  protected

  def load_targets
  	@targets = SimpleMetrics::Bucket.first.find_all_distinct_names.sort
  end

  def load_bookmarks
  	@bookmarks = []
  end
end
