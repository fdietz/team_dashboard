class Dashboard < ActiveRecord::Base
  has_many :widgets, :dependent => :destroy

  serialize :layout
  validates :name, :presence => true

  after_initialize :set_defaults

  attr_accessible :name, :time, :layout, :locked

  protected

  def set_defaults
    self.layout = [] unless self.layout
  end

end
