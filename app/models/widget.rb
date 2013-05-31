class Widget < ActiveRecord::Base
  belongs_to :dashboard

  serialize :settings

  validates :name, :presence => true
  validates :dashboard_id, :presence => true

  after_initialize :set_defaults

  attr_accessible :name, :kind, :size, :source, :targets, :range, :update_interval, :dashboard_id, :dashboard, :col, :row, :size_x, :size_y, :settings

  class << self

    def list_available
      path = Rails.root.join("app/assets/javascripts/widgets")
      Dir["#{path}/*"].map { |f| File.basename(f, '.*') }
    end

    def for_dashboard(id)
      where(:dashboard_id => id)
    end

    # settings specific attributes handling
    def slice_attributes(input)
      input.symbolize_keys!
      default_set = accessible_attributes.to_a.map(&:to_sym)
      input.slice(*default_set).merge(:settings => input.except(*default_set))
    end
  end

  # flatten settings hash
  def as_json(options = {})
    result = super(:except => :settings)
    result.merge!((settings || {}).stringify_keys)
    result
  end

  protected

  def set_defaults
    self.size = 1 unless self.size
    self.range = '30-minutes' unless self.range
    self.kind = 'graph' unless self.kind
    self.update_interval = 10 unless self.update_interval
  end

end
