require "erb"

# This is a temporary solution to store accounts, passworts, etc.
# Will be replaced by Rails 4.1 config/secrets.yml soonish
# http://edgeguides.rubyonrails.org/4_1_release_notes.html#config-secrets-yml

# Current conversations about this topic, including wether to add secrets.yml
# to source control by default:
#
# * https://github.com/rails/rails/pull/13388
# * https://github.com/rails/rails/pull/13463
#
# I expect to support something more closely to the [figaro](https://github.com/laserlemon/figaro)
# gem in the future. For now I wait until Rails 4.1 is released.
#
module BackendSettings
  def self.secrets
    @secrets ||= begin
      secrets = ActiveSupport::OrderedOptions.new
      yaml    = Rails.root.join("config/secrets.yml")

      if File.exist?(yaml)
        env_secrets = YAML.load(ERB.new(IO.read(yaml)).result)[Rails.env]
        secrets.merge!(env_secrets.symbolize_keys) if env_secrets
      end

      secrets
    end
  end
end