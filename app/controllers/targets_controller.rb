class TargetsController < ApplicationController

	def index
		@targets = SimpleMetrics::Bucket.first.find_all_distinct_names
	end

	def show
		@from = Time.now.to_i - 5.hours.ago.to_i
		@to = Time.now.to_i
		@target = params[:id]
		params[:time] = 'minute' if params[:time].blank?

		@data_points = prepare_data_points

		params[:debug] = true
		prepare_debugging if params[:debug]
	end

	private

	def prepare_data_points
		result = SimpleMetrics::Graph.query_all(bucket, @from, @to, @target).first.last
		@data_points = result.map do |data_point|
			ts = (Time.now.to_i - data_point[:ts])
			{ :ts => ts, :value => data_point[:value] }
		end
	end

	def prepare_debugging
		@debugging = {}
		timestamps = @data_points.map { |dp| dp[:ts] }
		values = @data_points.map { |dp| dp[:value] }
		@debugging[:total] = @data_points.size
		@debugging[:timestamp_min] = timestamps.min
		@debugging[:timestamp_max] = timestamps.max
		@debugging[:value_min] = values.min
		@debugging[:value_max] = values.max
	end

	def bucket
		case params[:time]
		when 'minute'
			SimpleMetrics::Bucket[0]
		when 'hour'
			SimpleMetrics::Bucket[1]
		when 'day'
			SimpleMetrics::Bucket[2]
		when 'week'
			SimpleMetrics::Bucket[3]
		end
	end
end