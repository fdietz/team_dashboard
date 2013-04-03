worker_processes 4
preload_app true
timeout 30
listen 3000

after_fork do |server, worker|
	ActiveRecord::Base.establish_connection
end

before_fork do |server, worker|
  old_pid = Rails.root + '/tmp/pids/unicorn.pid.oldbin'
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end
end
