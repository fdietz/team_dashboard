class AddTargets2ColumnToWidgets < ActiveRecord::Migration
  def change
    add_column :widgets, :targets2, :string
  end
end
