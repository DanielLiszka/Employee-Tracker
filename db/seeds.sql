INSERT INTO department (name)
VALUES 
('Information Systems and Technology'),
('Human Resources'),
('Security'),
('Sales'),
('Legal'),
('Accounting'),
('Management');

INSERT INTO role (title, yearly_income, department_id)
VALUES
('Accountant', 70000, 6),
('Paralegal', 50000, 5),
('Manager', 70000, 7),
('Engineer', 90000, 1),
('Marketing Coordindator', 70000, 4), 
('Operations Manager', 90000, 4),
('Project Manager', 100000, 7),
('Lead Developer', 65000, 1),
('Junior Developer', 45000, 1),
('Sales Rep', 34000,4),
('HR Rep', 32000,2);


INSERT INTO employee (first_name, surname, role_id, manager_id)
VALUES 
('Josepha', 'Aspen', 1, null),
('Hatty', 'Jan', 1, null),
('Zoe', 'Esmae', 2, null),
('Wade ', 'Peg', 3, null),
('Quincey ', 'Briscoe', 4, 4),
('Wolfe', 'Lorne', 5, 3),
('Bobbi', 'Alexandrina', 5, 3),
('Ashton', 'Brooke', 6, 2),
('Hylda', 'Cassarah', 7, null);

