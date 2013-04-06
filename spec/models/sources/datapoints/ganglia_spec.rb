require "spec_helper"

describe Sources::Datapoints::Ganglia do

  let(:source) { Sources::Datapoints::Ganglia.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "datapoints", :source => "ganglia", :targets => "test1;test2", :settings => {}) }
  let(:targets) { ['test1', 'test2'] }

  before do
    @from = 1.day.ago.to_i
    @to = Time.now.to_i
  end

  describe "#get" do
    it "calls request_datapoints" do
      input = [[[1, 123]],[[1, 456]]]
      source.expects(:request_datapoints).with(targets, @from, @to).returns(input)
      result = source.get(:from => @from, :to => @to, :widget_id => widget.id)
      result.first["target"].should == "test1"
      result.first["datapoints"].should == [[1, 123]]
      result.last["target"].should == "test2"
      result.last["datapoints"].should == [[1, 456]]
    end
  end

  describe "#available_targets" do
    before do
      @input = <<-EOF
      <xml>
        <CLUSTER NAME="ENV">
          <HOST NAME="host1">
            <METRIC NAME="metric1"></METRIC>
            <METRIC NAME="metric2"></METRIC>
          </HOST>
          <HOST NAME="host2">
            <METRIC NAME="metric1"></METRIC>
          </HOST>
        </CLUSTER>
      </xml>
      EOF
    end

    it "returns array of target names" do
      source.expects(:request_available_targets).returns(@input)
      result = source.available_targets
      assert result.include?("host1@ENV(metric1)")
      assert result.include?("host1@ENV(metric2)")
      assert result.include?("host2@ENV(metric1)")
    end

    it "searches for given pattern" do
      source.expects(:request_available_targets).returns(@input)
      result = source.available_targets(:pattern => "metric1")
      result.size.should == 2
    end

    it "limits returned targets" do
      source.expects(:request_available_targets).returns(@input)
      result = source.available_targets(:pattern => "metric1", :limit => 1)
      result.size.should == 1
    end
  end
end