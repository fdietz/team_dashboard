require 'open-uri'

module Sources
  module Ci
    class Demo < Sources::Ci::Base

      # Returns ruby hash:
      def get(options = {})
        {
          :label             => "Demo name",
          :last_build_time   => Time.now,
          :last_build_status => rand(2),
          :current_status    => rand(2)
        }
      end

    end
  end
end