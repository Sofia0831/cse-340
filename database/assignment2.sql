-- ASSIGNMENT 2
SELECT * FROM public.account;

-- 1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
	)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

-- 3
DELETE FROM public.account WHERE account_firstname = 'Tony';


-- 4
UPDATE public.inventory
SET inv_description = REGEXP_REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;


-- 5
SELECT inv_make, inv_model, classification_name
FROM public.inventory
	INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_id
	WHERE classification_name = 'Sport';

-- 6
UPDATE public.inventory
SET inv_image = REGEXP_REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


