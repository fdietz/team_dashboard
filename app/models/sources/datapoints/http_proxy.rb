module Sources
  module Datapoints
    class HttpProxy < Sources::Datapoints::Base
      include HttpProxyResolver

      def fields
        [
          { :name => "proxy_url", :title => "Proxy Url", :mandatory => true }
        ]
      end

      def get(options = {})
        from    = (options[:from]).to_i
        to      = (options[:to] || Time.now).to_i
        widget  = Widget.find(options.fetch(:widget_id))
        targets = targetsArray(widget.targets)

        params = { :from => from, :to => to, :targets => targets }

        widget        = Widget.find(options.fetch(:widget_id))
        response_body = ::HttpService.request(widget.settings.fetch(:proxy_url), :params => params)
      end

    end
  end
end