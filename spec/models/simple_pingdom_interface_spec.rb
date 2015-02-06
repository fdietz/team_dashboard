require "spec_helper"

describe SimplePingdomInterface do

  before(:each) do
    allow(cc(:plugins)).to receive(:pingdom).and_return(
      OpenStruct.new(user: 'user', password: 'pass', enabled?: true, api_key: 'the_key')
    )
  end

  context '#pingdom_url' do

    it 'generates a connection URL from the params' do
      interface = SimplePingdomInterface.new
      interface.pingdom_url.should eq 'https://user:pass@api.pingdom.com/api/2.0/checks'
    end

  end

  context '#make_request' do

    it 'makes a correct HTTP request' do
      interface = SimplePingdomInterface.new
      ::HttpService.expects(:request).with(interface.pingdom_url, headers: { 'App-Key' => 'the_key' }).returns(:response)
      interface.make_request.should eq interface
    end

    it 'has the response on the object after the request' do
      interface = SimplePingdomInterface.new
      ::HttpService.stubs(:request).returns('response')
      interface.make_request
      interface.response.should eq 'response'
    end

  end

  context 'working with the status table' do

    let(:test_status_table) { [ test_status ] }
    let(:test_status) { { 'label' => 'helloworld', 'value' => 'some val', 'status' => 0  } }

    context '#find_by_label' do

      it 'finds the value' do
        interface = SimplePingdomInterface.new
        interface.stubs(:status_table).returns(test_status_table)
        interface.find_by_label('helloworld').should eq test_status
      end

      it 'explodes if no correct label is given' do
        interface = SimplePingdomInterface.new
        interface.stubs(:status_table).returns(test_status_table)
        expect { interface.find_by_label('otherworld') }.to raise_error(SimplePingdomInterface::UnknownLabelError)
      end

    end

    context 'return values from the status' do

      it 'returns the value' do
        interface = SimplePingdomInterface.new
        interface.stubs(:status_table).returns(test_status_table)
        interface.value('helloworld').should eq 'some val'
      end

      it 'returns the status as a bool' do
        interface = SimplePingdomInterface.new
        interface.stubs(:status_table).returns(test_status_table)
        interface.status_ok?('helloworld').should be_truthy
      end

    end

  end

end
