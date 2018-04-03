require 'active_record/connection_adapters/mysql2_adapter'

NativeDbTypesOverride.configure({
    ActiveRecord::ConnectionAdapters::Mysql2Adapter => {
        primary_key: "int(11) auto_increment PRIMARY KEY"
    }
})