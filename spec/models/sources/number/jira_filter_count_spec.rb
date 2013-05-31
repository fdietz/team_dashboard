require "spec_helper"

describe Sources::Number::JiraFilterCount do

  subject { Sources::Number::JiraFilterCount.new }

  let(:widget) {
    FactoryGirl.create(:widget, :kind => "number", :source => "jira_filter_count", :settings => { :filter_id => "example_id" })
  }

  before do
    Rails.configuration.jira_url = "http://localhost"
    Rails.configuration.jira_user = "user"
    Rails.configuration.jira_password = "password"
  end

  describe "#get" do

    it "does an http request with configured url" do
      HttpService.expects(:request).with("http://user:password@localhost?maxResults=1000&jql=filter+%3D+example_id").returns({ "total" => 10 })
      subject.get(:widget_id => widget.id)
    end

    it "parses the total" do
      HttpService.expects(:request).returns({ "total" => 10 })
      result = subject.get(:widget_id => widget.id)
      result.should == { value: 10 }
    end
  end

end