--
-- function
--
create or replace function increment_version()
  returns trigger
as
$body$
begin
  new.version := new.version + 1;
  return new;
end;
$body$
language plpgsql;

create or replace function update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now(); 
  RETURN NEW;
END;
$$ language 'plpgsql';

--
-- member
--
CREATE TABLE {{m}} (
  id          SERIAL PRIMARY KEY,
  m_name      text NOT NULL, /* unique */
  m_mail      text NOT NULL, /* unique */
  m_pass      text NOT NULL, /* hashing */
  m_custom    jsonb NOT NULL,
  m_ip        text,
  m_role      integer NOT NULL default 0,
  m_status    integer NOT NULL default 0,
  otp_hash    text,
  created_at  TIMESTAMP WITH TIME ZONE not null DEFAULT (current_timestamp),
  updated_at  TIMESTAMP WITH TIME ZONE not null DEFAULT (current_timestamp),
  pass_upd_at TIMESTAMP WITH TIME ZONE not null DEFAULT (current_timestamp),
  failed_attempts          integer NOT NULL default 0,
  last_failed_attempts_at  TIMESTAMP WITH TIME ZONE,
  version integer not null default 0,
  CONSTRAINT m_name_unique UNIQUE (m_name),
  CONSTRAINT m_mail_unique UNIQUE (m_mail)
);

CREATE INDEX {{m}}_m_status_idx ON {{m}} (m_status);
CREATE UNIQUE INDEX {{m}}_m_name_idx ON {{m}} (m_name);
CREATE UNIQUE INDEX {{m}}_m_mail_idx ON {{m}} (m_mail);

create trigger version_trigger_{{m}}
  before update on {{m}}
  for each row execute procedure increment_version();

create trigger update_updated_at_{{m}}
  before update on {{m}}
  for each row execute procedure update_updated_at_column();

--
-- session
--
CREATE TABLE {{s}} (
  id           SERIAL PRIMARY KEY,
  members_id   integer REFERENCES {{m}}(id) ON DELETE CASCADE,
  m_name       text NOT NULL,
  m_role       integer default 0,
  m_ip         text NOT NULL,
  m_device     text NOT NULL,
  token        text NOT NULL,
  created_time integer NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE not null DEFAULT (current_timestamp),
  updated_at   TIMESTAMP WITH TIME ZONE not null DEFAULT (current_timestamp),
  version      integer not null default 0
);

ALTER TABLE {{s}} ADD CONSTRAINT ui_session_01 UNIQUE (m_ip, m_device, token);

ALTER TABLE {{s}} ADD CONSTRAINT ui_session_02 UNIQUE (m_ip, m_device, m_name);

create index m_name_idx on {{s}} (m_name);

create trigger version_trigger_{{s}}
  before update on {{s}}
  for each row execute procedure increment_version();

create trigger update_updated_at_{{s}}
  before update on {{s}}
  for each row execute procedure update_updated_at_column();
