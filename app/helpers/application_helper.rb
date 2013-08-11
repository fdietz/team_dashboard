module ApplicationHelper
	def humanize_timestamp(timestamp)
		Time.at(timestamp)
	end

  def script_tag_for_all_custom_fields
    Widget.list_available.map do |widget|
      id = "templates-custom_fields-#{widget}"
      <<-EOF
      <script type="text/ng-template" id="#{id}">
        #{render :text => control_groups(widget), :formats => [:html], :handlers => :erb}
      </script>
      EOF
    end.join("\n").html_safe
  end

  private

  def normalized_filename(file)
    file.to_s.gsub(".html", "").gsub(".erb", "")
  end

  def normalize_template_name(name)
    normalized_filename(name.to_s).gsub("/", "-")
  end

  # @source for example: number, ci, etc.
  # using ng-switch doesn't work, it breaks the form validation
  def control_groups(source)
    source = Sources.widget_type_to_source_type(source)

    source = Sources[source]
    result = []
    source.each do |key, value|
      result << "<div ng-show=\"'#{key}' == widget.source\">"
      value[:custom_fields].each do |field|
        result << control_group(key, field).html_safe
      end
      result << "</div>"
    end

    result.join.html_safe
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

end