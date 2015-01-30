module Sources
  module Number
    class GooglePageSpeedScore < Sources::Number::Base

      require 'json'
      class GooglePageSpeed
        API_URL = "https://www.googleapis.com/pagespeedonline/v1/runPagespeed"
        attr_accessor :api_key, :target_url, :strategy

        def initialize(opts = {})
          @api_key    = opts.fetch(:api_key)
          @target_url = opts.fetch(:target_url)
          @strategy   = opts.fetch(:strategy) { "desktop" }
        end

        def google_api_url
          "#{API_URL}?url=#{target_url}&key=#{api_key}&strategy=#{strategy}"
        end

        def response
          @response ||= `curl #{google_api_url}`
        end

        def json
          @json ||= JSON.parse response
        end

        def score
          json['score']
        end

      end

      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        strategy   = widget.settings.fetch(:strategy)
        target_url = widget.settings.fetch(:target_url)

        page_speed = GooglePageSpeed.new(
          target_url: target_url,
          api_key: cc(:plugins).google.api_key,
          strategy: strategy
        )

        { value: page_speed.score }
      end

      def custom_fields
        [
          { name: "target_url", title: "Target url", mandatory: true },
          { name: "strategy",   title: "Mobile or Desktop score? (mobile, desktop)", mandatory: true },
        ]
      end

      def available?
        cc(:plugins).google?
      end
    end
  end
end
