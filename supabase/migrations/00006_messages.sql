-- ============================================================
-- Messaging system for buyer-seller chat
-- ============================================================

-- Conversations (one per listing between buyer and seller)
create table conversations (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings(id) on delete cascade,
  buyer_id    uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(listing_id, buyer_id)
);

create index idx_conversations_buyer on conversations(buyer_id);
create index idx_conversations_seller on conversations(seller_id);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- Messages within conversations
create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  content         text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

create index idx_messages_conversation on messages(conversation_id);

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Participants can view conversations"
  on conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can start conversations"
  on conversations for insert
  with check (auth.uid() = buyer_id);

create policy "Participants can update conversations"
  on conversations for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

create policy "Participants can send messages"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

create policy "Recipients can mark messages read"
  on messages for update
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.buyer_id = auth.uid() or conversations.seller_id = auth.uid())
    )
  );

-- Enable realtime for messages
alter publication supabase_realtime add table messages;
