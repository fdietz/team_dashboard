class ChangeTargetsLengthWidgets < ActiveRecord::Migration
  def change
    change_column :widgets, :targets, :string, :limit => 5000
  end
end
