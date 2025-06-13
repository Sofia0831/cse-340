CREATE TYPE public.inventory_status AS ENUM 
('Available', 'Pending', 'Sold');

ALTER TABLE inventory
ADD COLUMN inv_status public.inventory_status NOT NULL DEFAULT 'Available';