desc "reset demo data set"
task :reset_demo => :environment do
  Rake::Task["cleanup"].invoke
  Rake::Task["populate"].invoke
end
