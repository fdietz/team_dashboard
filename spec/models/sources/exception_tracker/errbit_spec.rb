require "spec_helper"

describe Sources::ExceptionTracker::Errbit do

  let(:server_url) { "http://localhost" }
  let(:api_key) { "12345" }
  let(:errbit) { Sources::ExceptionTracker::Errbit.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "exception_tracker", :source => "errbit", :settings => { :server_url => server_url, :api_key => api_key }) }

  describe "#get" do
    it "returns a hash" do
      time = Time.now
      input = { "name" => "name", "last_error_time" => time.iso8601, "unresolved_errors" => 7 }
      errbit.expects(:request_stats).with(server_url, api_key).returns(input)
      result = errbit.get(:widget_id => widget.id)
      result.should == {
        :label             => "name",
        :last_error_time   => time.iso8601.to_s,
        :unresolved_errors => 7
      }
    end
  end
end
