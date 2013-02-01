TeamDashboard::Application.routes.draw do

  namespace :api do
    resources :dashboards do
      resources :widgets
    end

    resource  :datapoints, :only => :show
    resource  :counter, :only => :show
    resource  :ci, :only => :show, :controller => "ci"
    resource  :exception_tracker, :only => :show
    resource  :number, :only => :show
    resource  :boolean, :only => :show
    resources :datapoints_targets, :only => :index
  end

  # copy of backbone routes render the initial layout for first request
  match "dashboards"     => "layout#index"
  match "dashboards/:id" => "layout#index"
  match "dashboards/:id/fullscreen" => "layout#index"
  match "about"          => "layout#index"

  root :to => 'layout#index'
end
