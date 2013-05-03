# -*- encoding : utf-8 -*-
require "bundler"
require "./app/models/sources/number/base"

Bundler.setup(:test)

describe Sources::Jira do

  describe "#count_by_filter_id" do
    it "returns some ticktes for a given filter" do
      ticket_count = Sources::Jira.count_by_filter_id 10230
      ticket_count.should be_a(Fixnum)
    end
  end
end
