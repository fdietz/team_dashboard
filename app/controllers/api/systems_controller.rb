module Api
  class SystemsController < BaseController

    def show
      @system = System.new
      respond_with @system
    end

  end
end
