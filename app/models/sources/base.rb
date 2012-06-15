module Sources
  class Base
    def initialize(options = {})
    end
    
    def metrics
      raise "implement me"
    end

    def datapoints(targets, from, to = nil)
      raise "implement me"
    end

    def datapoint(target, at)
      raise "implement me"
    end

  end
end