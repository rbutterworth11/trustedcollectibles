-- Add COA and pricing fields to listings
alter table listings add column team text not null default '';
alter table listings add column signature_photo text;
alter table listings add column accept_offers boolean not null default false;
alter table listings add column minimum_offer integer;
alter table listings add column coa_front text;
alter table listings add column coa_back text;
alter table listings add column coa_hologram text;
alter table listings add column coa_source text;
alter table listings add column coa_certificate_number text;

-- Drop the old authentication_details column (replaced by structured COA fields)
alter table listings drop column authentication_details;
