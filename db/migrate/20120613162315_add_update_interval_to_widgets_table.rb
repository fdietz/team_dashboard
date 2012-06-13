class AddUpdateIntervalToWidgetsTable < ActiveRecord::Migration
  def change
    add_column :widgets, :update_interval, :integer
  end
end
