require "spec_helper"

describe SimplePingdomInterface do

  context '#pingdom_url' do

    it 'generates a connection URL from the params' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'check')
      interface.pingdom_url.should eq 'https://user:pass@api.pingdom.com/api/2.0/checks'
    end

  end

  context '#make_request' do

    it 'makes a correct HTTP request' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'check')
      ::HttpService.expects(:request).with(interface.pingdom_url, headers: { 'App-Key' => 'the_key' }).returns(:response)
      interface.make_request.should eq interface
    end

    it 'has the response on the object after the request' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'check')
      ::HttpService.stubs(:request).returns('response')
      interface.make_request
      interface.response.should eq 'response'
    end

  end

  context 'response results' do

    let(:test_check) { { 'name' => 'helloworld', 'lastresponsetime' => '111', 'status' => 'up' } }
    let(:test_response) { { 'checks' => [ test_check ] } }

    it 'gets the check response' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'helloworld')
      interface.stubs(:response).returns(test_response)
      interface.check_response.should eq test_check
    end

    it 'explodes if no correct check is given' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'hellosomething')
      interface.stubs(:response).returns(test_response)
      expect { interface.check_response }.to raise_error
    end

    it 'can return the response time' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'hellosomething')
      interface.stubs(:check_response).returns(test_check)
      interface.response_time.should eq 111
    end

    it 'can return the response status' do
      interface = SimplePingdomInterface.new('user', 'pass', 'the_key', 'hellosomething')
      interface.stubs(:check_response).returns(test_check)
      interface.status.should be_true
    end

  end

end
