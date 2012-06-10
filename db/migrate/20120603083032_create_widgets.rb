class CreateWidgets < ActiveRecord::Migration
  def change
    create_table :widgets do |t|
      t.string :name
      t.string :kind
      t.string :size
      t.string :source
      t.string :targets
      t.string :time
      t.text   :settings
      t.references :dashboard
      t.timestamps
    end
  end
end
