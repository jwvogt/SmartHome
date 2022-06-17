CREATE TABLE IF NOT EXISTS doors_and_windows (
    id      serial      NOT NULL,
    name    text        NOT NULL,
    room    text        NOT NULL,
    isOpen  boolean     NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS appliances (
    -- this table includes all lights, tvs, etc. in the house.
    id          serial      NOT NULL,
    name        text        NOT NULL,
    room        text        NOT NULL,
    isOn        boolean     NOT NULL,
    power_use   int         NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS thermostat (
    -- i'm thinking this will be a table with only one row
    id        serial      NOT NULL,
    unit      text        NOT NULL,
    temp      int         NOT NULL,
    PRIMARY KEY (id)
);