
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
  d2.widgets.create!(:name => "Counter", :kind => 'counter', :settings => {
    :source1 => 'demo', :targets1 => target1, :aggregate_function1 => 'sum',
    :source2 => 'demo', :targets2 => target2, :aggregate_function2 => 'average'
    }
  )
  d2.widgets.create!(:name => "Number", :kind => 'number', :settings => {
    :source1 => 'http_proxy', :label1 => "Build duration", "http_proxy-http_proxy_url1" => "http://ci.jenkins-ci.org/job/infra_plugin_changes_report/lastBuild/api/json", "http_proxy-value_path1" => "duration",
    :source2 => 'demo', :label2 => "Errors per day",
    :source3 => 'demo', :label3 => "Errors per minute"
    }
  )
  d2.widgets.create!(:name => "Boolean", :kind => 'boolean', :source2 => 'demo', :settings => {
    :source1 => 'http_proxy', :label1 => "Jenkins Status", "http_proxy-http_proxy_url1" => "http://ci.jenkins-ci.org/job/infra_plugin_changes_report/lastBuild/api/json", "http_proxy-value_path1" => "building",
    :source2 => 'demo', :label2 => "DB Health",
    :source3 => 'demo', :label3 => "App Status"
    }
  )
  d2.widgets.create!(:name => "Two Targets Stacked Graph", :targets => [target1, target2].join(','), :size => 3, :source => 'demo', :graph_type => 'stack')

  d3 = Dashboard.create!(:name => "Example 3 (Jenkins and Travis CI Builds)")
  d3.widgets.create!(:name => "Jenkins/Travis CI", :kind => 'ci', :settings => {
    :source1 => 'jenkins', "jenkins-server_url1" => "http://ci.jenkins-ci.org/", "jenkins-project1" => 'infra_plugin_changes_report',
    :source2 => 'travis', "travis-server_url2" => "http://travis-ci.org", "travis-project2" => 'travis-ci/travis-ci'
    }
  )
end