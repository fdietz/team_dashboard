module Api
  class BaseController < ApplicationController
    rescue_from ActiveRecord::RecordNotFound, :with => :show_errors

    respond_to :json

    protected

    def show_errors(e)
      logger.error("Dashboard with id #{params[:dashboard_id]} not found: #{e}")
      render :json => { :message => "Dashboard with id #{params[:dashboard_id]} not found" }, :status => :unprocessable_entity
    end
  end
end