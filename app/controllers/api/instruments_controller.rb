module Api
  class InstrumentsController < ApplicationController

    respond_to :json
    
    def show
      instrument = SimpleMetrics::InstrumentRepository.find_one(params[:id])
      puts "== instrument#show #{instrument.inspect}"
      respond_with instrument.attributes.to_json
    end

    def index
      instruments = SimpleMetrics::InstrumentRepository.find_all
      respond_with instruments.inject([]) { |result, m| result << m.attributes }.to_json
    end

    def create
      attributes = JSON.parse(request.body.read.to_s).symbolize_keys
      SimpleMetrics::InstrumentRepository.save(SimpleMetrics::Instrument.new(attributes))
      head :status => 201
    end

    def update
      attributes = JSON.parse(request.body.read.to_s).symbolize_keys
      instrument = SimpleMetrics::InstrumentRepository.find_one(params[:id])
      instrument.metrics = attributes[:metrics]
      instrument.name = attributes[:name]
      SimpleMetrics::InstrumentRepository.update(instrument)
      head :status => 204
    end
  end
end