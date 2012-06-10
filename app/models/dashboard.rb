class Dashboard < ActiveRecord::Base
  has_many :widgets, :dependent => :destroy

  serialize :layout
  validates :name, :presence => true

  after_initialize :set_defaults

  protected

  def set_defaults
    self.layout = [] unless self.layout
  end

end
