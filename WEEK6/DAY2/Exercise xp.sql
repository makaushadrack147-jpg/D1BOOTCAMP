

-- PostgreSQL / pgAdmin 4 SQL worksheet

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET client_min_messages = warning;
SET search_path = public;

-- Run queries 1-4 while connected to the public database.

SELECT *
FROM public.items
ORDER BY price ASC;

SELECT *
FROM public.items
WHERE price >= 80
ORDER BY price DESC;

SELECT first_name, last_name
FROM public.customers
ORDER BY first_name ASC
LIMIT 3;

SELECT last_name
FROM public.customers
ORDER BY last_name DESC;

-- Connect to the dvdrental database before running queries 5-15.

SELECT *
FROM customer;

SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM customer;

SELECT DISTINCT create_date
FROM customer;

SELECT *
FROM customer
ORDER BY first_name DESC;

SELECT film_id, title, description, release_year, rental_rate
FROM film
ORDER BY rental_rate ASC;

SELECT address, phone
FROM address
WHERE district = 'Texas';

SELECT *
FROM film
WHERE film_id IN (15, 150);

SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title = 'Chamber Italian';

SELECT film_id, title, description, length, rental_rate
FROM film
WHERE title ILIKE 'Ch%';

SELECT *
FROM film
ORDER BY rental_rate ASC, film_id ASC
LIMIT 10;

SELECT *
FROM film
ORDER BY rental_rate ASC, film_id ASC
LIMIT 10 OFFSET 10;

SELECT c.first_name, c.last_name, p.amount, p.payment_date
FROM customer AS c
JOIN payment AS p ON p.customer_id = c.customer_id
ORDER BY c.customer_id ASC;

SELECT f.*
FROM film AS f
LEFT JOIN inventory AS i ON i.film_id = f.film_id
WHERE i.inventory_id IS NULL;

SELECT city.city, country.country
FROM city
JOIN country ON country.country_id = city.country_id;

SELECT c.customer_id,
       c.first_name,
       c.last_name,
       p.amount,
       p.payment_date
FROM customer AS c
JOIN payment AS p ON p.customer_id = c.customer_id
ORDER BY p.staff_id ASC;



