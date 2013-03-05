module Sources
   module Boolean
      class Shell < Sources::Boolean::Base
         def fields
            [
              { :name => "command", :title => "Shell Command", :mandatory => true }
            ]
          end

          def get(options = {})
            exec_result = %x[ #{options.fetch(:fields).fetch(:command)} ]
            return { :value => $?.exitstatus == 0 }
          end
      end
   end
end