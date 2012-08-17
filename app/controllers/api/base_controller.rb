module Api
  class BaseController < ApplicationController
    respond_to :json

    rescue_from Exception, :with => :show_internal_server_error

    rescue_from ActiveRecord::RecordNotFound, :with => :show_not_found_error
    rescue_from Timeout::Error, :with => :show_timeout_error
    rescue_from Errno::ECONNREFUSED, Errno::EHOSTUNREACH, :with => :show_connection_error

    protected

    def show_timeout_error(e)
      logger.error("Timeout Error: #{e}")
      respond_with({ :message => "Time out error" }.to_json, :status => 500)
    end

    def show_connection_error(e)
      logger.error("Connection error: #{e}")
      respond_with({ :message => "#{e}" }.to_json, :status => 500)
    end

    def show_internal_server_error(e)
      response  = e.response if e.respond_to?(:response)
      logger.error(error_log_message(e))
      error_hash = { :message   => "Internal server error: #{e}", :response  => response }
      respond_with(error_hash.to_json, :status => 500)
    end

    def show_not_found_error(e)
      logger.error("Record not found: #{e}")
      render :json => { :message => "Record not found error" }, :status => :unprocessable_entity
    end

    private

    def error_log_message(e)
      backtrace = e.backtrace.join("\n")
      error = "Internal Server Error: #{e.inspect} \n#{backtrace}"
    end
  end
end