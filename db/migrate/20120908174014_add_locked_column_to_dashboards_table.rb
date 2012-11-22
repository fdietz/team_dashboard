class AddLockedColumnToDashboardsTable < ActiveRecord::Migration
  def change
    add_column :dashboards, :locked, :boolean, :default => false
  end
end
