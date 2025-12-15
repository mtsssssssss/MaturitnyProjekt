CREATE TYPE role_enum AS ENUM ('user', 'admin');

CREATE TABLE IF NOT EXISTS pouzivatel (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username varchar(32) NOT NULL UNIQUE,
  password text NOT NULL,
  role role_enum NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now()
);


*********************************************************************************************************


CREATE TABLE IF NOT EXISTS predmet (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_name varchar(64) NOT NULL,
  subject_abbrev char(3) NOT NULL UNIQUE
);


CREATE TYPE question_type_enum AS ENUM ('abcd', 'dopisovacia', 'matching');

CREATE TABLE IF NOT EXISTS otazka (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_fk int NOT NULL,
  typ question_type_enum NOT NULL,
  text_otazky text NOT NULL,
  spravna_odpoved varchar(256),

  CONSTRAINT fk_otazka_predmet
    FOREIGN KEY (subject_fk) REFERENCES predmet(id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS abcd_moznosti (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  otazka_fk int NOT NULL,
  text varchar(256) NOT NULL,
  je_spravna boolean NOT NULL DEFAULT false,

  CONSTRAINT fk_abcd_otazka
    FOREIGN KEY (otazka_fk) REFERENCES otazka(id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS matching_otazka_moznosti (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  otazka_fk int NOT NULL,
  text_lava varchar(256) NOT NULL,
  text_prava varchar(256) NOT NULL,

  CONSTRAINT fk_matching_otazka
    FOREIGN KEY (otazka_fk) REFERENCES otazka(id)
    ON DELETE CASCADE
);


*********************************************************************************************************


CREATE TABLE IF NOT EXISTS test (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_fk int NOT NULL,
  predmet_fk int NOT NULL,
  vytvoreny_datum timestamptz NOT NULL DEFAULT now(),
  dokonceny_datum timestamptz,
  uspesnost numeric(5,2),
  
  -- pridat casovy limit v sekundach
  --pridat start testu ako casovy udaj

  CONSTRAINT fk_test_pouzivatel
    FOREIGN KEY (user_fk) REFERENCES pouzivatel(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_test_predmet
    FOREIGN KEY (predmet_fk) REFERENCES predmet(id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS test_otazka (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  test_fk int NOT NULL,
  otazka_fk int NOT NULL,
  poradie integer NOT NULL,
  UNIQUE (test_fk, poradie),
  UNIQUE (test_fk, otazka_fk),

  CONSTRAINT fk_testotazka_test
    FOREIGN KEY (test_fk) REFERENCES test(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_testotazka_otazka
    FOREIGN KEY (otazka_fk) REFERENCES otazka(id)
    ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS odpoved_pouzivatela (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  test_otazka_fk int NOT NULL,
  zadana_odpoved varchar(256),
  vybrana_moznost_fk int,
  je_spravna boolean,

  CONSTRAINT fk_odpoved_testotazka
    FOREIGN KEY (test_otazka_fk) REFERENCES test_otazka(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_odpoved_abcd
    FOREIGN KEY (vybrana_moznost_fk) REFERENCES abcd_moznosti(id)
    ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS odpoved_matching (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  odpoved_fk int NOT NULL,
  matching_otazka_moznosti_fk int NOT NULL,
  zadana_prava_strana varchar(256) NOT NULL,
  je_spravna boolean NOT NULL DEFAULT false,

  CONSTRAINT fk_matching_odpoved
    FOREIGN KEY (odpoved_fk) REFERENCES odpoved_pouzivatela(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_matching_moznost
    FOREIGN KEY (matching_otazka_moznosti_fk) REFERENCES matching_otazka_moznosti(id)
    ON DELETE CASCADE
);
