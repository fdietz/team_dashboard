require "spec_helper"

describe Sources::FileInput::File do
  let(:input_file) { Rails.root.join('vendor', 'test_file_input.json') }
  let(:file_input) { Sources::FileInput::File.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "file_input", :source => "file", :settings => { :input_file => input_file } ) }

  describe "#get" do
    it "returns overall_value" do
      result = file_input.get(:widget_id => widget.id)
      result.should == {:overall_value=>0, :label=>[{:label=>"Curabitur condimentum leo", :value=>"2013/03/11"}]}
    end
  end
end
