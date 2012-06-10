class CreateDashboards < ActiveRecord::Migration
  def change
    create_table :dashboards do |t|
      t.string :name
      t.string :time
      t.string :layout
      t.timestamps
    end
  end
end
