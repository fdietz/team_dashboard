require 'spec_helper'

describe JenkinsInterface do

  let(:interface) { JenkinsInterface.new }

  context '#result_status' do

    it 'returns 0 as a success status' do
      interface.result_status('success').should eq 0
    end

    it 'returns 1 as a failure status' do
      interface.result_status('failure').should eq 1
    end

    it 'returns -1 for an unknown status' do
      interface.result_status('fnordodo').should eq(-1)
    end

  end

  context '#build_status' do

    it 'returns 0 for sleeping status' do
      interface.build_status('sleeping').should eq 0
    end

    it 'returns 1 for building status' do
      interface.build_status('building').should eq 1
    end

    it 'returns -1 for an unknown status' do
      interface.build_status('bingobongo').should eq(-1)
    end

  end

  context '#request_build_status' do

    it 'makes the call to the http url' do
      ::HttpService.expects(:request).with('some_url/cc.xml').returns('some_data')
      interface.server_url = 'some_url'
      interface.request_build_status.should eq 'some_data'
    end

  end

  context 'parsing projects' do

    let(:build_time) { Time.zone.parse('2013-12-15 12:02:54 +0100') }

    let(:test_result) { {
      'name' => 'some_build',
      'lastBuildTime' => build_time.to_s,
      'lastBuildStatus' => 'success',
      'activity' => 'sleeping'
    } }

    let(:test_result_list) {
      { "Projects" => { "Project" => [ test_result ] } }
    }

    it 'turns the build result into a status' do
      interface.expects(:result_status).with('success').returns(17)
      interface.expects(:build_status).with('sleeping').returns(23)
      interface.project_to_status(test_result).should eq({
        label: 'some_build',
        last_build_time: build_time,
        last_build_status: 17,
        current_status: 23
      })
    end

    it 'takes all project build results and puts them in a table' do
      interface.stubs(:parsed_build_status).returns(test_result_list)
      interface.expects(:project_to_status).with(test_result).returns({ some: 'result' })
      interface.project_table.should eq [{ some: 'result' }]
    end

    it 'can return a single result' do
      interface.stubs(:project_table).returns([{ label: 'some_label' }])
      interface.single_result('some_label').should eq({ label: 'some_label' })
    end

    it 'can return a status table' do
      interface.stubs(:project_table).returns([{ label: 'some_label',
                                                 last_build_status: 0,
                                                 current_status: 0,
                                                 last_build_time: build_time
      }])
      interface.status_table.should eq([{
        "status" => 0,
        "label" => 'some_label',
        "value" => '11:02:54',
      }])
    end

  end

end
