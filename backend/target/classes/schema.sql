-- Create database if not exists
-- CREATE DATABASE IF NOT EXISTS restaurant_reservation;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_datetime ON reservations(reservation_date_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_table ON reservations(table_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations(reservation_code);

CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON restaurant_tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_tables_status ON restaurant_tables(status);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);

CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(active);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_availability_search ON reservations(restaurant_id, reservation_date_time, status);
CREATE INDEX IF NOT EXISTS idx_table_availability ON restaurant_tables(restaurant_id, status, active);