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

    protected

    def latest_datapoint(dps)
      dps.reject { |dp| dp.first.nil? }.sort { |a, b| b.last <=> a.last }.first
    end

  end
end