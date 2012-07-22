require 'open-uri'

module Sources
  module HttpProxy
    extend self

    def request(url)
      uri = URI.parse(url)
      Rails.logger.debug("Requesting from #{uri} ...")
      JSON.parse(uri.read)
    rescue JSON::ParserError => e
      Rails.logger.error "Error while parsing JSON response: #{e}"
      nil
    end
  end
end