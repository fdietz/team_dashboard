require "spec_helper"

describe Sources::StatusTable::JsonFile do
  let(:input_file) { Rails.root.join('vendor', 'test_status_table.json') }
  let(:status_table) { Sources::StatusTable::JsonFile.new }
  let(:widget) { FactoryGirl.create(:widget, :kind => "status_table", :source => "json_file", :settings => { :input_file => input_file } ) }

  describe "#get" do
    it "returns overall_value" do
      result = status_table.get(:widget_id => widget.id)
      result.should == {:overall_value=>0, :first_value=>{"status"=>"0", "label"=>"Curabitur condimentum leo", "value"=>"2013/03/11"}, :label=>[{"status"=>"0", "label"=>"Curabitur condimentum leo", "value"=>"2013/03/11"}]}
    end
  end
end
