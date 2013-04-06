module Sources
  module Datapoints

    class Error < StandardError; end
    class NotFoundError < Error; end

    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def fields
        []
      end

      def get(options = {})
      end

      protected

      def targetsArray(targets)
        targets.split(";").map { |t| t.strip }
      end

      @@cache = {}

      def cached_get(key)
        return yield if Rails.env.test?

        time = Time.now.to_i
        if entry = @@cache[key]
          if entry[:time] > 5.minutes.ago.to_i
            Rails.logger.info("Sources::Datapoints - CACHE HIT for #{key}")
            return entry[:value]
          end
        end

        value = yield
        @@cache[key] = { :time => time, :value => value }
        value
      end
    end
  end
end