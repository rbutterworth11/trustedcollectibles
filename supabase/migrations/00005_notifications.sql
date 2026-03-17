-- ============================================================
-- Notifications system
-- ============================================================

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  type        text not null check (type in (
    'offer_received', 'offer_accepted', 'offer_declined', 'offer_withdrawn',
    'order_paid', 'order_shipped', 'order_delivered', 'order_completed',
    'review_received', 'listing_approved', 'listing_rejected',
    'new_message'
  )),
  title       text not null,
  body        text,
  link        text,
  read        boolean not null default false,
  data        jsonb,
  created_at  timestamptz not null default now()
);

create index idx_notifications_user on notifications(user_id);
create index idx_notifications_unread on notifications(user_id) where read = false;

-- RLS
alter table notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- System can insert notifications (via service role or triggers)
create policy "Service can insert notifications"
  on notifications for insert
  with check (true);
