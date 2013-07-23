#
# Use the "Value Path" setting to select nested value from JSON structure:
#   {
#     "parent" : {
#       "child" : {
#         "child2" : "myValue"
#       }
#     }
#   }
#
# Example: parent.child.nestedChild.value
module Sources
  module StatusTable
    class HttpProxy < Sources::StatusTable::Base
      include HttpProxyResolver

      def get(options = {})
        parsed_json = super(options)

        build_json_response(parsed_json)
      end
    end
  end
end