class JenkinsInterface

  attr_accessor :server_url

  def initialize(server_url = nil)
    self.server_url = server_url
  end

  def request_build_status
    url = "#{server_url}/cc.xml"
    Rails.logger.debug("Requesting from #{url} ...")
    ::HttpService.request(url)
  end

  def parsed_build_status
    status = request_build_status
    XML::Parser.string(status).parse rescue status
  end

  def project_to_status(data)
    {
      :label             => data["name"],
      :last_build_time   => Time.parse(data["lastBuildTime"]),
      :last_build_status => result_status(data["lastBuildStatus"]),
      :current_status    => build_status(data["activity"])
    }
  end

  def project_table
    parsed_build_status["Projects"]["Project"].map { |project| project_to_status(project) }
  end

  def status_table
    project_table.map do |status|
      {
        'status' => status[:last_build_status] == 0 ? 0 : 2,
        'label' => status[:label],
        'value' => status[:last_build_time].strftime('%H:%M:%S')
      }
    end
  end

  def single_result(label)
    project_table.find { |result| result[:label] == label }
  end

  def result_status(status)
    case status
    when /success/i
      0
    when /failure/i
      1
    else
      -1
    end
  end

  def build_status(status)
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
