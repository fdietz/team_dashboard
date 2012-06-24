class AddAggregateFunctionToWidgets < ActiveRecord::Migration
  def change
    add_column :widgets, :aggregate_function, :string
    add_column :widgets, :aggregate_function2, :string
  end
end
