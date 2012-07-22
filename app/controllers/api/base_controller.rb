module Api
  class BaseController < ApplicationController
    respond_to :json

    rescue_from Exception, :with => :show_internal_server_error
    rescue_from ActiveRecord::RecordNotFound, :with => :show_errors
    rescue_from Timeout::Error, :with => :show_timeout_error
    rescue_from Errno::ECONNREFUSED, Errno::EHOSTUNREACH, :with => :show_connection_error

    protected

    def show_timeout_error(e)
       respond_with({ :message => "Time out Error #{e}" }.to_json, :status => 500)
    end

    def show_connection_error(e)
      respond_with({ :message => "#{e}" }.to_json, :status => 500)
    end

    def show_internal_server_error(e)
      respond_with({ :message => "Internal Server Error" }.to_json, :status => 500)
    end

    def show_errors(e)
      logger.error("Dashboard with id #{params[:dashboard_id]} not found: #{e}")
      render :json => { :message => "Dashboard with id #{params[:dashboard_id]} not found" }, :status => :unprocessable_entity
    end
  end
end