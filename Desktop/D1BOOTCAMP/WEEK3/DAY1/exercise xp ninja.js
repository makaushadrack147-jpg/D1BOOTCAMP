// Exercise 1 : Checking the BMI
const person1 = {
  FullName: "John",
  Mass: 78,
  Height: 1.7,
  bmi: function () {
    return this.Mass / (this.Height * this.Height);
  }
};

const person2 = {
  FullName: "Sarah",
  Mass: 65,
  Height: 1.6,
  bmi: function () {
    return this.Mass / (this.Height * this.Height);
  }
};

function compareBMI(personA, personB) {
  const bmiA = personA.bmi();
  const bmiB = personB.bmi();

  if (bmiA > bmiB) {
    console.log(`${personA.FullName} has the largest BMI.`);
  } else if (bmiB > bmiA) {
    console.log(`${personB.FullName} has the largest BMI.`);
  } else {
    console.log("Both people have the same BMI.");
  }
}

compareBMI(person1, person2);

// Exercise 2 : Grade Average
function findAvg(gradesList) {
  let total = 0;
  for (let i = 0; i < gradesList.length; i++) {
    total += gradesList[i];
  }

  const average = total / gradesList.length;
  console.log(`Average: ${average}`);

  if (average > 65) {
    console.log("Passed");
  } else {
    console.log("Failed. You must repeat the course.");
  }
}

const grades = [70, 80, 90, 60, 55];
findAvg(grades);

// Bonus: split into two functions
function calculateAverage(gradesList) {
  let total = 0;
  for (let i = 0; i < gradesList.length; i++) {
    total += gradesList[i];
  }
  return total / gradesList.length;
}

function checkPassOrFail(gradesList) {
  const average = calculateAverage(gradesList);
  console.log(`Average: ${average}`);

  if (average > 65) {
    console.log("Passed");
  } else {
    console.log("Failed. You must repeat the course.");
  }
}

checkPassOrFail([75, 82, 88, 70, 69]);
