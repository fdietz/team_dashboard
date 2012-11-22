# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'jasmine' do
  watch(%r{spec/javascripts/spec\.(js\.coffee|js|coffee)$})         { "spec/javascripts" }
  watch(%r{spec/javascripts/.+_spec\.(js\.coffee|js|coffee)$})
  watch(%r{app/assets/javascripts/(.+?)\.(js|coffee)})  { |m| "spec/javascripts/#{m[1]}_spec.#{m[2]}" }
end

guard 'jasmine' do
  watch(%r{spec/javascripts/spec\.(js\.coffee|js|coffee)$})         { "spec/javascripts" }
  watch(%r{spec/javascripts/.+_spec\.(js\.coffee|js|coffee)$})
  watch(%r{app/assets/javascripts/(.+?)\.(js|coffee)})  { |m| "spec/javascripts/#{m[1]}_spec.#{m[2]}" }
end
