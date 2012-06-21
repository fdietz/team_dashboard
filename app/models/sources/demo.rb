module Sources
  class Demo < Base

    def initialize(options = {})
    end
    
    def metrics
      metrics = []
      metrics << "demo.example1"
      metrics << "demo.example2"
      metrics
    end

    def datapoints(targets, from, to = nil)
      to = to || Time.now.to_i
      datapoints = []
      targets.each do |target|
        datapoints << { :target => "demo.example1", :datapoints => generate_datapoints(from, to) }
      end
      datapoints
    end

    def datapoints_at(targets, aggregate_function, at)
      latest_datapoint(generate_datapoints(at-600, at)).first
    end

    private

    def generate_datapoints(from, to)
      range = to - from
      interval = case range
      when 60*30 then 10
      when  60*60 then 10
      when  3600*3 then 10*3
      when  3600*6 then 10*6
      when  3600*12 then 10*12
      when  3600*24 then 10*24
      when  3600*24*3 then 10*12*3
      when  3600*24*7 then 10*12*7
      when  3600*24*7*4 then 10*12*7*4
      else 10 end

      result = []
      timestamp = from
      while (timestamp < to) 
        result << [1+rand(100), timestamp]    
        timestamp = timestamp + interval*5 #* (1+rand(5))
      end
      result
    end
  end
end