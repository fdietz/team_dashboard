# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130327120046) do

  create_table "dashboards", :force => true do |t|
    t.string   "name"
    t.string   "time"
    t.string   "layout"
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.boolean  "locked",     :default => false
  end

  create_table "widgets", :force => true do |t|
    t.string   "name"
    t.string   "kind"
    t.string   "size"
    t.string   "source"
    t.string   "targets",         :limit => 5000
    t.string   "range"
    t.text     "settings"
    t.integer  "dashboard_id"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
    t.integer  "update_interval"
    t.integer  "col"
    t.integer  "row"
    t.integer  "size_x"
    t.integer  "size_y"
  end

end
