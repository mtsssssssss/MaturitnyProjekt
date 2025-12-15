SELECT * FROM questions.subject
ORDER BY "Id" ASC LIMIT 100



INSERT INTO questions.subject ("Id","SubjectName", "SubjectAbbrev")
VALUES (gen_random_uuid(),'Slovenský jazyk a literatúra', 'SLJ');

INSERT INTO questions.subject ("Id","SubjectName", "SubjectAbbrev")
VALUES (gen_random_uuid(),'Matematika', 'MAT');
