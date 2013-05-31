require 'open-uri'

module Sources
  module ExceptionTracker
    class Demo < Sources::ExceptionTracker::Base

      # Returns ruby hash:
      def get(options = {})
        {
          :label             => "Demo application",
          :last_error_time   => Time.now,
          :unresolved_errors => rand(10)
        }
      end

    end
  end
end
