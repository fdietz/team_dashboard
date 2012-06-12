module Sources
  class Base
    def initialize(options = {})
    end
    
    def metrics
      raise "implement me"
    end

    def datapoints(time = 'minute')
      raise "implement me"
    end
  end
end