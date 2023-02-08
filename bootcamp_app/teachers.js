const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

// From lecture can also do it without the slice(2) ---> [, , cohortName] = process.argv
const [cohortName] = process.argv.slice(2);

const queryString = (`
SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
FROM teachers
JOIN assistance_requests ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name = $1
ORDER BY teacher;
`)

// Can also do WHERE cohorts.name LIKE $1
// Then change the below to [`%${cohortName}%`]
// Makes it more similar to the way the search is happening in students.js

const values = [cohortName];

pool.connect() // first we connect (async)
  .then(() => pool.query(queryString, values))
  .then(res => {
    res.rows.forEach(row => {
      console.log(`${row.cohort}: ${row.teacher}`);
    })
  })
  .catch(err => console.error('query error', err.stack))
  .finally(() => pool.end()); // we CLOSE the connection with end.