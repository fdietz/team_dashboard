class RemoveLockedFromDashboards < ActiveRecord::Migration
  def change
    remove_column :dashboards, :locked
  end
end
