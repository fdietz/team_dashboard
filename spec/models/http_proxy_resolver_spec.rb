require "spec_helper"

describe HttpProxyResolver do

  class MyHttpProxyResolver
    include HttpProxyResolver
  end

  describe "#resolve_value" do
    subject { MyHttpProxyResolver.new }

    it "returns nested hash" do
      input = { "value" => { "nested_value1" => { "nested_value2" => "value2" } } }
      subject.resolve_value(input, "value.nested_value1.nested_value2").should == "value2"
    end

  end

end