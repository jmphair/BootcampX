const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

// From lecture can also do it without the slice(2) ---> [, , cohortName, limit] = process.argv
const [cohortName, limit] = process.argv.slice(2);

const queryString = (`
SELECT students.id as student_id, students.name as name, cohorts.name as cohort
FROM students
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE $1
LIMIT $2;
`)

const values = [`%${cohortName}%`, limit];

pool.connect() // first we connect (async)
  .then(() => pool.query(queryString, values)) 
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`);
    })
  })
  .catch(err => console.error('query error', err.stack))
  .finally(() => pool.end()); // we CLOSE the connection with end.