require 'open-uri'

module Sources
  module Ci
    class JenkinsCc < Sources::Ci::Jenkins

      # Returns ruby hash:
      def get(options = {})
        fields  = options.fetch(:fields)
        project = fields.fetch(:project)
        result  = request_build_status(fields.fetch(:server_url))
        # older jenkins version don't return application/json as Content-Type,
        # we need to parse it explicitly
        result = XML::Parser.string(result).parse rescue result
        result["Projects"]["Project"].each do |data|
          if data['name'] == project
            return {
              :label             => data["name"],
              :last_build_time   => Time.parse(data["lastBuildTime"]),
              :last_build_status => status(data["lastBuildStatus"]),
              :current_status    => current_status(data["activity"])
            }
          end
        end
        {}
      end

      def request_build_status(server_url)
        url = "#{server_url}/cc.xml"
        Rails.logger.debug("Requesting from #{url} ...")
        ::HttpService.request(url, :ssl => {:verify => false})
      end

      def current_status(status)
        case status
        when /sleeping/i
          0
        when /building/i
          1
        else
          -1
        end
      end

    end
  end
end
