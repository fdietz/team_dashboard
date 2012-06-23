module DemoHelper
  extend self
  
  def generate_datapoints(from, to)
    range = to - from
    interval = case range
    when 60*30 then 10
    when 60*60 then 10
    when 3600*3 then 10*3
    when 3600*6 then 10*6
    when 3600*12 then 10*12
    when 3600*24 then 10*24
    when 3600*24*3 then 10*12*3
    when 3600*24*7 then 10*12*7
    when 3600*24*7*4 then 10*12*7*4
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