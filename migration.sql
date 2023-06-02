-- public.assignment_status definition

-- Drop table

-- DROP TABLE assignment_status;

CREATE TABLE assignment_status (
	id_status serial4 NOT NULL,
	status_code varchar NULL,
	status_name varchar NULL,
	CONSTRAINT assignment_status_pkey PRIMARY KEY (id_status)
);

-- public.assignments definition

-- Drop table

-- DROP TABLE assignments;

CREATE TABLE assignments (
	id_assignment serial4 NOT NULL,
	ref_id_form int4 NULL,
	ref_id_team_member int4 NULL,
	created_at timestamp NULL,
	created_by varchar NULL,
	updated_at timestamp NULL,
	updated_by varchar NULL,
	ref_id_status int4 NULL,
	"name" varchar NULL,
	phone varchar NULL,
	message varchar(255) NULL,
	assignment_ref uuid NOT NULL DEFAULT gen_random_uuid(),
	final_score int4 NULL DEFAULT 0,
	CONSTRAINT assignments_pkey PRIMARY KEY (id_assignment)
);

-- public.form definition

-- Drop table

-- DROP TABLE form;

CREATE TABLE form (
	id_form serial4 NOT NULL,
	form_name varchar NULL,
	form_is_active bpchar(1) NULL DEFAULT 'Y'::bpchar,
	created_at timestamp NULL,
	created_by varchar NULL,
	updated_by varchar NULL,
	updated_at timestamp NULL,
	CONSTRAINT form_pkey PRIMARY KEY (id_form)
);

-- public.question definition

-- Drop table

-- DROP TABLE question;

CREATE TABLE question (
	id_question serial4 NOT NULL,
	ref_id_form int4 NULL,
	question_details varchar NULL,
	question_order int4 NULL,
	ref_id_question_type int4 NULL,
	created_at timestamp NULL,
	created_by varchar NULL,
	updated_at timestamp NULL,
	updated_by varchar NULL,
	is_active bpchar(1) NULL DEFAULT 'Y'::bpchar,
	CONSTRAINT question_pkey PRIMARY KEY (id_question)
);

-- public.question_type definition

-- Drop table

-- DROP TABLE question_type;

CREATE TABLE question_type (
	id_question_type serial4 NOT NULL,
	question_type_code varchar NULL,
	question_type_name varchar NULL,
	CONSTRAINT question_type_pkey PRIMARY KEY (id_question_type)
);

-- public.question_type definition

-- Drop table

-- DROP TABLE question_type;

CREATE TABLE question_type (
	id_question_type serial4 NOT NULL,
	question_type_code varchar NULL,
	question_type_name varchar NULL,
	CONSTRAINT question_type_pkey PRIMARY KEY (id_question_type)
);

-- public.team_department definition

-- Drop table

-- DROP TABLE team_department;

CREATE TABLE team_department (
	id_team_department serial4 NOT NULL,
	department_name varchar NULL,
	department_description varchar NULL,
	CONSTRAINT team_department_pkey PRIMARY KEY (id_team_department)
);

-- public.team_member definition

-- Drop table

-- DROP TABLE team_member;

CREATE TABLE team_member (
	id_team_member serial4 NOT NULL,
	first_name varchar NULL,
	last_name varchar NULL,
	contact varchar NULL,
	email varchar NULL,
	created_at timestamp NULL,
	created_by varchar NULL,
	updated_at timestamp NULL,
	updated_by varchar NULL,
	username varchar NULL,
	"password" varchar NULL,
	ref_id_department int4 NULL,
	is_active bpchar(1) NULL DEFAULT 'Y'::bpchar,
	CONSTRAINT team_member_pkey PRIMARY KEY (id_team_member)
);