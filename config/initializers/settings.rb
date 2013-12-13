require 'yaml'
require 'ostruct'

settings_file = File.join(RAILS_ROOT, 'config', 'backend_settings.yml')

if File.exists?(settings_file)
  settings = YAML.load_file(settings_file)
  settings = settings.inject(Hash.new) do |struct, vals|
    key, settings = vals
    struct[key] = OpenStruct.new(settings)
    struct
  end
  ::BackendSettings = OpenStruct.new(settings).freeze
else
  raise('Please copy over the example config/backend_settings.yml and modify it to your needs.')
end
