require "spec_helper"

describe Sources::Datapoints::Base do

  describe "#aggregated_result" do

    before do
      @input = [
        { 'target' => 'test1', 'datapoints' => [[1, 123]]},
        { 'target' => 'test2', 'datapoints' => [[2, 123]]}
      ]
      @base = Sources::Datapoints::Base.new
    end

    it "aggregates results using sum function" do
      @base.aggregated_result(@input, 'sum').should eq(3)
    end

    it "aggregates results using average function" do
      @base.aggregated_result(@input, 'average').should eq(1)
    end
  end

  describe "#aggregate" do

    before do
      @input = [[1, 123], [2, 123]]
      @base = Sources::Datapoints::Base.new
    end

    it "aggregates datapoints using sum function" do
      @base.aggregate(@input, 'sum').should eq(3)
    end

    it "aggregates datapoints using average function" do
      @base.aggregate(@input, 'average').should eq(1)
    end

    it "aggregates datapoints using delta function" do
      input = [[1, 123], [5, 123]]
      @base.aggregate(input, 'delta').should eq(4)
    end
  end
end