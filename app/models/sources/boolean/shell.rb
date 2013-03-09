module Sources
  module Boolean
    class Shell < Sources::Boolean::Base

      def fields
        [ { :name => "command", :title => "Shell Command", :mandatory => true } ]
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        cmd    = widget.settings.fetch(:command)
        { :value => execute_command(cmd) }
      end

      private

      def execute_command(cmd)
        system(cmd)
      end

    end
  end
end