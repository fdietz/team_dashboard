
desc "Populate with sample data set"
task :cleanup => :environment do
  Dashboard.destroy_all
end

desc "Populate with sample data set"
task :populate => :environment do
  target1 = "demo.example1"
  target2 = "demo.example2"

  d1 = Dashboard.create!(:name => "Example 1 (Graph Widgets)")
  d1.widgets.create!(:name => "Single Target Line Graph", :targets => target1, :size_x => 1, :size_y => 2, :source => 'demo', :settings => { :graph_type => 'line' })
  d1.widgets.create!(:name => "Two Targets Line Graph", :targets => [target1, target2].join(';'), :size_x => 2, :size_y => 2, :source => 'demo', :settings => { :graph_type => 'line' })
  d1.widgets.create!(:name => "Two Targets Stacked Graph", :targets => [target1, target2].join(';'), :size_x => 3, :size_y => 2, :source => 'demo', :settings => { :graph_type => 'area' })

  d2 = Dashboard.create!(:name => "Example 2 (Numbers, Boolean and Graph Widgets)")
  d2.widgets.create!(:name => "Number", :kind => 'number', :size_x => 2, :source => 'http_proxy', :settings => { :label => "Build duration (sec)",:proxy_url => "http://ci.jenkins-ci.org/job/infra_plugin_changes_report/lastBuild/api/json", :proxy_value_path => "duration" })
  d2.widgets.create!(:name => "Number", :kind => 'number', :source => 'demo', :settings => { :label => "Errors per day" })
  d2.widgets.create!(:name => "Number", :kind => 'number', :source => 'demo', :settings => { :label => "Errors per minute" })

  d2.widgets.create!(:name => "Boolean", :kind => 'boolean', :source => 'http_proxy', :settings => {
    :label => "Jenkins Status", :proxy_url => "http://ci.jenkins-ci.org/job/infra_plugin_changes_report/lastBuild/api/json", :proxy_value_path => "building" })

  d2.widgets.create!(:name => "Two Targets Stacked Graph", :targets => [target1, target2].join(';'), :size_x => 2, :size_y => 2, :source => 'demo', :settings => { :graph_type => 'area' })

  d2.widgets.create!(:name => "Boolean", :kind => 'boolean', :source => 'demo', :settings => { :label => "DB Health" })
  d2.widgets.create!(:name => "Boolean", :kind => 'boolean', :source => 'demo', :settings => { :label => "App Status" })


  d3 = Dashboard.create!(:name => "Example 3 (Jenkins and Travis CI Builds)")
  d3.widgets.create!(:name => "Jenkins", :kind => 'ci', :source => 'jenkins', :settings => {
    :server_url => "http://ci.jenkins-ci.org/", :project => 'infra_plugin-compat-tester' })
  d3.widgets.create!(:name => "Travis CI", :kind => 'ci', :source => 'travis', :settings => {
    :server_url => "http://travis-ci.org", :project => 'travis-ci/travis-ci' } )

  d4 = Dashboard.create!(:name => "Example 4 (Meter, Alert)")
  d4.widgets.create!(:name => "Meter Example", :kind => 'meter', :size_y => 2, :source => 'demo', :settings => { :label => "Current Visitors" })
  d4.widgets.create!(:name => "Alert", :kind => 'alert', :source => 'demo', :size_x => 2)
end

desc "Migrate widgets"
task :migrate_widgets => :environment do
  Dashboard.all.each do |dashboard|
    puts "Migrating Dashboard #{dashboard.id}"
    dashboard.widgets.all.each do |w|
      puts "Widget #{w.id}"
      case w.kind
      when blank? || "graph"
        # set kind and dimensions
        w.kind = "graph"
        w.size_x = w.size
        w.size_y = 2
        w.save!
      when "number"
        # create 3 new widgets based on 3-in-1 number widget
        (1..3).each do |index|
          break unless w.settings[:"source#{index}"]
          params = { :kind => "number", :name => "#{w.name}-#{index}", :size_x => 1, :size_y => 1,
            :source => w.settings[:"source#{index}"],
            :settings => { :label => w.settings[:"label#{index}"], :use_metric_suffix => true } }.with_indifferent_access

          if w.settings[:"source#{index}"] == "http_proxy"
            params[:settings].merge!(:proxy_url => w.settings["http_proxy-http_proxy_url#{index}"],
              :proxy_value_path => w.settings["http_proxy-value_path#{index}"])
          end
          dashboard.widgets.create!(params)
        end
        w.destroy
      when "boolean"
        # create 3 new widgets based on 3-in-1 number widget
        (1..3).each do |index|
          break unless w.settings[:"source#{index}"]
          params = { :kind => "boolean", :name => "#{w.name}-#{index}", :size_x => 1, :size_y => 1,
            :source => w.settings[:"source#{index}"],
            :settings => { :label => w.settings[:"label#{index}"] } }.with_indifferent_access

          if w.settings[:"source#{index}"] == "http_proxy"
            params[:settings].merge!(:proxy_url => w.settings["http_proxy-http_proxy_url#{index}"],
             :proxy_value_path => w.settings["http_proxy-value_path#{index}"])
          end
          dashboard.widgets.create!(params)
        end
        w.destroy
      when "ci"
        # create 3 new widgets based on 3-in-1 number widget
        (1..3).each do |index|
          break unless w.settings[:"source#{index}"]
          params = { :kind => "ci", :name => "#{w.name}-#{index}", :size_x => 1, :size_y => 1,
            :source => w.settings[:"source#{index}"],
            :settings => {} }.with_indifferent_access

          if w.settings[:"source#{index}"] == "http_proxy"
            params[:settings].merge!(:proxy_url => w.settings["http_proxy-http_proxy_url#{index}"],
              :proxy_value_path => w.settings["http_proxy-value_path#{index}"])
          end

          if w.settings[:"source#{index}"] == "jenkins"
            params[:settings].merge!(:server_url => w.settings["jenkins-server_url#{index}"])
            params[:settings].merge!(:project => w.settings["jenkins-project#{index}"])
          end

          if w.settings[:"source#{index}"] == "travis"
            params[:settings].merge!(:server_url => w.settings["travis-server_url#{index}"])
            params[:settings].merge!(:project => w.settings["travis-project#{index}"])
          end

          dashboard.widgets.create!(params)
        end
        w.destroy
      else
        puts "else"
      end
    end

  end
end