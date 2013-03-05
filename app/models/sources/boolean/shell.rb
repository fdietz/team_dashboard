module Sources
  module Boolean
    class Shell < Sources::Boolean::Base

      def fields
        [ { :name => "command", :title => "Shell Command", :mandatory => true } ]
      end

      def get(options = {})
        cmd = options.fetch(:fields).fetch(:command)
        { :value => execute_command(cmd) }
      end

      private

      def execute_command(cmd)
        system(cmd)
      end

    end
  end
end