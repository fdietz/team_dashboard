# based on https://devcenter.heroku.com/articles/rails-unicorn
worker_processes Integer(ENV["WEB_CONCURRENCY"] || 3)
preload_app true
timeout 30
listen Integer(ENV["PORT"] || 3000)

after_fork do |server, worker|

  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

	if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    puts 'Connected to ActiveRecord'
  end
end

before_fork do |server, worker|

  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
  end

  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    puts 'Disconnected from ActiveRecord'
  end
end
