TeamDashboard::Application.routes.draw do

  mount Jasminerice::Engine => '/jasmine' if Rails.env.test?

  namespace :api do
    resources :dashboards do
      resources :widgets
    end

    resources :datapoints_targets, :only => :index
    match "data_sources/:kind" => "data_sources#index"
  end

  match "dashboards"     => "layout#index"
  match "dashboards/:id" => "layout#index"
  match "about"          => "layout#index"

  root :to => 'layout#index'
end
