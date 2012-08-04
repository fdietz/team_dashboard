require 'open-uri'

module Sources
  module Ci
    class Demo

      # Returns ruby hash:
      def get(server_url, project, options = {})
        {
          :label             => "Demo name",
          :last_build_time   => Time.now,
          :last_build_status => rand(2) == 1,
          :current_status    => 1
        }
      end

    end
  end
end