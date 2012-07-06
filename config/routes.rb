TeamDashboard::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  namespace :api do
    resources :metrics
    resources :dashboards do
      resources :widgets
    end
  end

  match "api/datapoints" => "api/datapoints#show"
  match "api/number" => "api/numbers#show"
  match "api/boolean" => "api/booleans#show"

  # copy of backbone routes render the initial layout for first request
  match "dashboards" => "home#index"
  match "dashboards/:id" => "home#index"
  match "about" => "home#index"

  root :to => 'home#index'
end
