require "spec_helper"

describe Sources::ExceptionTracker::Errbit do

  before do
    @errbit = Sources::ExceptionTracker::Errbit.new
    @server_url = "http://localhost"
    @api_key = "12345"
  end

  describe "#get" do
    it "returns a hash" do
      time = Time.now
      input = { "name" => "name", "last_error_time" => time.iso8601, "unresolved_errors" => 7 }
      @errbit.expects(:request_stats).with(@server_url, @api_key).returns(input)
      result = @errbit.get(:fields => { :server_url => @server_url, :api_key => @api_key })
      result.should == {
        :label             => "name",
        :last_error_time   => time.iso8601.to_s,
        :unresolved_errors => 7
      }
    end
  end
end
