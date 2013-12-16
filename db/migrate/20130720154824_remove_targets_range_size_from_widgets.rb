class RemoveTargetsRangeSizeFromWidgets < ActiveRecord::Migration
  def up
    Widget.all.each do |widget|
      widget.settings ||= {}
      widget.settings[:targets] = widget.targets if widget.targets.present?
      widget.settings[:range]   = widget.range if widget.range.present?
      widget.settings[:size]    = widget.size if widget.size.present?
      widget.save!
    end

    remove_column :widgets, :targets
    remove_column :widgets, :range
    remove_column :widgets, :size
  end

  def down
    add_column :widgets, :targets, :string
    add_column :widgets, :range, :string
    add_column :widgets, :size, :string
  end
end
