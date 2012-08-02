require 'open-uri'
require 'nokogiri'
module Sources
  module Boolean

    # Simple jenkins module. Abuses the proxy url field to give the jenkins status file as
    # project_name@http://jenkins.some/cc.xml
    class Jenkins < Sources::Boolean::Base

      def jenkins_doc(base_url)
        Nokogiri::XML.parse(URI.parse(base_url).read)
      end

      def project_node(base_url, project)
        jenkins_doc(base_url).xpath("//Project[@name='#{project}']").first
      end

      def get(options = {})
        project, url = options.fetch(:http_proxy_url).split('@')
        result = project_node(url, project).attributes['lastBuildStatus'].value
        { :value => (result == "Success") }
      end
    end
  end
end