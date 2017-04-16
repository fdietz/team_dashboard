source "https://rubygems.org"

gem "rails", "~> 4.0.0"

# required by newrelic_api gem
gem "activeresource", "~> 4.0.0"

gem "sass-rails", "~> 4.0.0"
gem "bootstrap-sass", "~> 2.3.2"
gem "bootswatch-rails"

gem "mysql2"

# on windows replace with thin gem
gem "unicorn"

gem "faraday"
gem "faraday_middleware"
gem "multi_xml"
gem "libxml-ruby"

# see app/model/sources/number/jenkins_game.rb
gem "nokogiri"

# see app/model/sources/number/new_relic.rb
gem "newrelic_api"

# assets
gem "therubyracer"
gem "uglifier"

group :test, :development do
  gem "byebug"
  gem "rspec-rails"
  gem "factory_girl_rails"
  gem "mocha", :require => false
end

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "foreman"
end

group :production do
  gem 'rails_12factor' # remove if not deploying on heroku
end

ruby "2.0.0"
