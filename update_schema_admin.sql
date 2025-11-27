-- Add verification_status column to profiles table
alter table profiles 
add column verification_status text default 'pending';

-- Update existing rows to have 'pending' status if null
update profiles 
set verification_status = 'pending' 
where verification_status is null;
