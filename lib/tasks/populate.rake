
desc "Populate with sample data set"
task :cleanup => :environment do
  Dashboard.destroy_all
end

desc "Populate with sample data set"
task :populate => :environment do
  target1 = "test.page.visits"
  target2 = "test.invoices.send"

  d1 = Dashboard.create!(:name => "Example 1 Line Graph Widget")
  d1.widgets.create!(:name => "Page Visits", :targets => target1)

  d3 = Dashboard.create!(:name => "Example 2 Combined Line Graph Widget")
  d3.widgets.create!(:name => "Page Visits/Send Invoices", :targets => [target1, target2].join(','))

  d4 = Dashboard.create!(:name => "Example 3 Combined, 2 Line Graphs")
  d4.widgets.create!(:name => "Page Visits", :targets => target1, :size => 1)
  d4.widgets.create!(:name => "Send Invoices", :targets => target2, :size => 2)

  d5 = Dashboard.create!(:name => "Example 4 Combined, 3 Line Graphs")
  d5.widgets.create!(:name => "Page Visits", :targets => target1, :size => 1)
  d5.widgets.create!(:name => "Send Invoices", :targets => target2, :size => 2)
  d5.widgets.create!(:name => "Page Visits/Send Invoices", :targets => [target1, target2].join(','), :size => 3)

  d6 = Dashboard.create!(:name => "Example 5 Counter Widget")
  d6.widgets.create!(:name => "Page Visits", :targets => target1, :kind => 'counter')

  d6 = Dashboard.create!(:name => "Example 6 Combined Counter Widget")
  d6.widgets.create!(:name => "Page Visits", :targets => [target1, target2].join(','), :kind => 'counter')
end
