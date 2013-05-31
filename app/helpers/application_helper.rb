module ApplicationHelper
	def humanize_timestamp(timestamp)
		Time.at(timestamp)
	end

  # TODO: cleanup all!!

  # Performance optimization, since we can't precompile Angular.js templates
  # but don't want to use inline templates, we create <script> tags instead
  #
  # When "fetching" templates based on the URL Angular.js will first check if
  # a script tag with an ID matching a template URL exists before doing the
  # HTTP request.
  #
  # It would be nice to use sprockets JST to load and compile templates
  # client-side instead in the future.
  #
  def script_tag_for_all_templates
    templates_dir = Rails.root.join("app/assets/javascripts/templates")
    files = Dir[templates_dir + "**/*.html"].reject {|fn| File.directory?(fn) }
    files += Dir[templates_dir + "**/*.html.erb"].reject {|fn| File.directory?(fn) }

    files.map do |file|
      id = "templates-#{normalize_template_name(Pathname(file).relative_path_from(templates_dir))}"
      <<-EOF
      <script type="text/ng-template" id="#{id}">
        #{render :file => normalized_filename(file), :formats => [:html], :handlers => :erb}
      </script>
      EOF
    end.join("\n").html_safe
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

  def normalized_filename(file)
    file.to_s.gsub(".html", "").gsub(".erb", "")
  end

  def normalize_template_name(name)
    normalized_filename(name.to_s).gsub("/", "-")
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
    # TODO: fix mapping
    source = source == "graph" ? "datapoints" : source
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