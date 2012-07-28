
desc "Populate with sample data set"
task :cleanup => :environment do
  Dashboard.destroy_all
end

desc "Populate with sample data set"
task :populate => :environment do
  target1 = "demo.example1"
  target2 = "demo.example2"

  d1 = Dashboard.create!(:name => "Example 1 (Graph Widgets)")
  d1.widgets.create!(:name => "Single Target Line Graph", :targets => target1, :size => 1, :source => 'demo')
  d1.widgets.create!(:name => "Two Targets Line Graph", :targets => [target1, target2].join(','), :size => 2, :source => 'demo')
  d1.widgets.create!(:name => "Two Targets Stacked Graph", :targets => [target1, target2].join(','), :size => 3, :source => 'demo', :graph_type => 'stack')

  d2 = Dashboard.create!(:name => "Example 2 (Counters, Numbers, Boolean and Graph Widgets)")
  d2.widgets.create!(:name => "Counter", :kind => 'counter',
    :source1 => 'demo', :targets1 => target1, :aggregate_function1 => 'sum',
    :source2 => 'demo', :targets2 => target2, :aggregate_function2 => 'average'
  )
  d2.widgets.create!(:name => "Number", :kind => 'number',
    :source1 => 'demo', :label1 => "Total Errors all time",
    :source2 => 'demo', :label2 => "Errors per day",
    :source3 => 'demo', :label3 => "Errors per minute"
  )
  d2.widgets.create!(:name => "Boolean", :kind => 'boolean', :source2 => 'demo',
    :source1 => 'demo', :label1 => "Web App Jenkins Build",
    :source2 => 'demo', :label2 => "DB Health",
    :source3 => 'demo', :label3 => "App Status"
  )
  d2.widgets.create!(:name => "Two Targets Stacked Graph", :targets => [target1, target2].join(','), :size => 3, :source => 'demo', :graph_type => 'stack')
end