module ApplicationHelper
	def humanize_timestamp(timestamp)
		Time.at(timestamp)
	end

  # TODO: cleanup all three methods!!

  def script_tag_for_all_templates
    Widget.list_available.map do |widget|
      id = "templates/custom_fields/#{widget}"
      <<-EOF
      <script type="text/ng-template" id="#{id}">
        #{render :text => control_groups(widget), :formats => [:html]}
      </script>
      EOF
    end.join("\n").html_safe
  end

  def control_group(key, field)
    name = "#{field[:name]}"
    mandatory = field.fetch(:mandatory, false)

    <<-EOF
      <div td-field label="#{field[:title]}">
        <input name="#{name}" ng-model="widget.#{name}" type="text" ng-required="widget.source == '#{key}' && #{mandatory}"/>
      </div>
    EOF
  end

  # @source for example: number, ci, etc.
  # using ng-switch doesn't work, it breaks the form validation
  def control_groups(source)
    source = Sources.custom_fields(source)
    result = []
    source.each do |key, value|
      result << "<div ng-show=\"'#{key}' == widget.source\">"
      value["fields"].each do |field|
        result << control_group(key, field).html_safe
      end
      result << "</div>"
    end

    result.join.html_safe
  end
end