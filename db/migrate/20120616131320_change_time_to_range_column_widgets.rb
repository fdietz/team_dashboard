class ChangeTimeToRangeColumnWidgets < ActiveRecord::Migration
  def change
    rename_column :widgets, :time, :range
  end
end
