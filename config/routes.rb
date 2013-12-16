TeamDashboard::Application.routes.draw do

  namespace :api do
    resources :dashboards do
      resources :widgets
    end

    resource :system

    resources :datapoints_targets, :only => :index
    get "data_sources/:kind" => "data_sources#index"
  end

  get "dashboards"     => "layout#index"
  get "dashboards/:id" => "layout#index"
  get "about"          => "layout#index"

  root :to => 'layout#index'
end
