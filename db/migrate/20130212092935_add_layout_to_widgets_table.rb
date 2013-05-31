class AddLayoutToWidgetsTable < ActiveRecord::Migration
  def change
    add_column :widgets, :col, :integer
    add_column :widgets, :row, :integer
    add_column :widgets, :size_x, :integer
    add_column :widgets, :size_y, :integer
  end
end
