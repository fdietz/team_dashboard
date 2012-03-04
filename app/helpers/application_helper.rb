module ApplicationHelper
	def humanize_timestamp(timestamp)
		Time.at(timestamp)
	end
end
