require "spec_helper"

describe Aggregation do

  describe "#aggregated_result" do

    before do
      @input = [
        { :target => 'test1', :datapoints => [[1, 123]]},
        { :target => 'test2', :datapoints => [[2, 123]]}
      ]
    end

    it "aggregates results using sum function" do
      Aggregation.aggregated_result(@input, 'sum').should eq(3)
    end

    it "aggregates results using average function" do
      Aggregation.aggregated_result(@input, 'average').should eq(1)
    end
  end

  describe "#aggregate" do

    before do
      @input = [[1, 123], [2, 123]]
    end

    it "aggregates datapoints using sum function" do
      Aggregation.aggregate(@input, 'sum').should eq(3)
    end

    it "aggregates datapoints using average function" do
      Aggregation.aggregate(@input, 'average').should eq(1)
    end

    it "aggregates datapoints using delta function" do
      input = [[1, 123], [5, 123]]
      Aggregation.aggregate(input, 'delta').should eq(4)
    end
  end
end