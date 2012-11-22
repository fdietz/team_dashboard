#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

TeamDashboard::Application.load_tasks

unless Rails.env.production?
  require 'guard/jasmine/task'

  Guard::JasmineTask.new
  Guard::JasmineTask.new(:jasmine_no_server, '-s none')

  task :default => %w[spec guard:jasmine]
end
