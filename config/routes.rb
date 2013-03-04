TeamDashboard::Application.routes.draw do

  mount Jasminerice::Engine => '/jasmine' if Rails.env.test?

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

  match "dashboards"     => "layout#index"
  match "dashboards/:id" => "layout#index"
  match "about"          => "layout#index"

  root :to => 'layout#index'
end
