source "https://rubygems.org"

gem "rails", "~> 3.2.13"

gem "less-rails", "~> 2.2.6"
gem "less-rails-bootstrap", "~> 2.3.0"

gem "mysql2", "~> 0.3.11"

gem "unicorn"
gem "foreman"
gem "faraday", "~> 0.8.4"
gem "faraday_middleware", "~> 0.8.8"
gem "multi_xml", "~> 0.5.1"
gem "libxml-ruby", "~> 2.3.3"
gem "nokogiri", "~> 1.5.5"

gem "newrelic_api", "~> 1.2"

group :test, :development do
  gem 'debugger'
  gem "rspec-rails"
  # gem "jasmine"
  gem "factory_girl_rails"
  # gem "jasminerice"
  # gem "guard-jasmine"
  # gem "rb-fsevent", "~> 0.9.1"
  gem "mocha", :require => false
end

group :development do
  gem "better_errors"
  gem "binding_of_caller"
end

group :assets do
  gem "sass-rails", "~> 3.2.5"

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  gem "therubyracer", "~> 0.10.2"

  gem "uglifier", ">= 1.0.3"
end
