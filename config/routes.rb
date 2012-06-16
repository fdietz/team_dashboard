SimpleMetricsWebapp::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  namespace :api do
    resources :metrics
    # resources :instruments
    resources :dashboards do
      resources :widgets
    end
  end

  match "api/graph" => "api/datapoints#show"
  match "api/datapoints" => "api/datapoints#show"

  # routes render the initial layout (client side rendering)
  match "metrics/:source" => "home#index", :constraints => { :source => /[^\/]+/ }
  match "metrics/:source/:name" => "home#index", :constraints => { :source => /[^\/]+/, :name => /[^\/]+/ }
  # match "instruments" => "home#index"
  # match "instruments/:id" => "home#index"
  match "dashboards" => "home#index"
  match "dashboards/:id" => "home#index"
  match "about" => "home#index"

  root :to => 'home#index'
end
