require "erb"

# This is a temporary solution to store accounts, passworts, etc.
# Will be replaced by Rails 4.1 config/secrets.yml soonish
# http://edgeguides.rubyonrails.org/4_1_release_notes.html#config-secrets-yml
module BackendSettings
  def self.secrets
    @secrets ||= begin
      secrets = ActiveSupport::OrderedOptions.new
      yaml    = Rails.root.join("config/secrets.yml")

      if File.exist?(yaml)
        env_secrets = YAML.load(ERB.new(IO.read(yaml)).result)[Rails.env]
        secrets.merge!(env_secrets.symbolize_keys) if env_secrets
      else
        raise('Please copy over the example config/secrets.yml and modify it to your needs.') unless Rails.env.test?
      end

      secrets
    end
  end
end