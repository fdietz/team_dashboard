FactoryGirl.define do
  factory :dashboard do
    name 'Example Dashboard'
  end

  factory :widget do
    name 'Example Widget'
    association :dashboard
  end
end