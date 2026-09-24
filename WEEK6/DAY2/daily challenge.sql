-- PostgreSQL / pgAdmin 4 SQL worksheet

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET client_min_messages = warning;
SET search_path = public;

DROP TABLE IF EXISTS FirstTab;
DROP TABLE IF EXISTS SecondTab;

CREATE TABLE FirstTab (
	id integer,
	name varchar(10)
);

INSERT INTO FirstTab (id, name) VALUES
	(5, 'Pawan'),
	(6, 'Sharlee'),
	(7, 'Krish'),
	(NULL, 'Avtaar');

SELECT *
FROM FirstTab;

CREATE TABLE SecondTab (
	id integer
);

INSERT INTO SecondTab (id) VALUES
	(5),
	(NULL);

SELECT *
FROM SecondTab;

-- Q1 predicted output: 0
SELECT COUNT(*)
FROM FirstTab AS ft
WHERE ft.id NOT IN (
	SELECT id
	FROM SecondTab
	WHERE id IS NULL
);

-- Q2 predicted output: 2
SELECT COUNT(*)
FROM FirstTab AS ft
WHERE ft.id NOT IN (
	SELECT id
	FROM SecondTab
	WHERE id = 5
);

-- Q3 predicted output: 0
SELECT COUNT(*)
FROM FirstTab AS ft
WHERE ft.id NOT IN (
	SELECT id
	FROM SecondTab
);

-- Q4 predicted output: 2
SELECT COUNT(*)
FROM FirstTab AS ft
WHERE ft.id NOT IN (
	SELECT id
	FROM SecondTab
	WHERE id IS NOT NULL
);
