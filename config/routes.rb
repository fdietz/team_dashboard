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
  match "api/counter" => "api/counters#show"
  match "api/ci" => "api/ci#show"
  match "api/number" => "api/numbers#show"
  match "api/boolean" => "api/booleans#show"

  # copy of backbone routes render the initial layout for first request
  match "dashboards" => "layout#index"
  match "dashboards/:id" => "layout#index"
  match "about" => "layout#index"

  root :to => 'layout#index'
end
