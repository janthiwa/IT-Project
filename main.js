/**
array
*/

let age1 = 25;
let age2 = 30;
let age3 = 35;
confirm.log([age1, age2, age3]); // [25, 30, 35]

let ages = [25, 30, 35];
console.log(ages); // [25, 30, 35]
console.log(ages[1]); // 25 , 30 , 35

//แทนที่ค่าในอาเรย์
ages.push(55);
console.log(ages); // [40, 45, 50]

//ต่ออาเรย์
ages.push(55);
console.log(ages); // [40, 45, 50]
[40,45,50,55]

//ความยาวของอาเรย์
console.log(ages.length); // 4

//ลบสมาชิกตัวสุดท้ายของอาเรย์
ages.pop();
console.log(ages); // [40, 45, 50]

if (ages.includes(45)) { //true
    console.log("พบ 45 ในอาเรย์"); //พบ 45 ในอาเรย์
}

let numbers = [90, 60, 80, 40, 50];
numbers.sort();
console.log(numbers); // [40, 50, 60, 80, 90]

//let name.push("John , "Jane", "Doe");
name.push("Smith");
console.log(name);
console.log(name.length);

for (let i = 0; i < name.length; i++) {
    console.log(name[i]);
}

/**
object
 */
let stusdent = [{
//let age = 20
//let name = "Emmma"
//let grade = "A"
},{
    age: 22,
    name: "Liam",
    grade: "B"
}];

stusdent.pop();


for (let i = 0; i < student.length; i++) {
    console.log("Student " + (i + 1) + ";");
    console.log("Name: " + student[i].name);
    console.log("Age: " + student[i].age);
    console.log("Grade: " + student[i].grade);
}

stusdent.push({
    age: 21,
    name: "Olivia",
    grade: "A"
});

console.log(student);
console.log(student.name);

/**
function
 */

//ประกาศฟังก์ชัน
function calculate_grade(score) {
    if (score >= 90) {
//        grade "A";
    } else if (score >= 80) {
 //       grade "B";
    } else if (score >= 70) {
 //       grade "C";
    } else if (score >= 60) {
 //       grade "D";
    } else {
 //       grade "F";
    }
 //   return grade;
}

// เรียกใช้ฟังก์ชัน
let student_score = 85;
let student_grade = calculate_grade(student_score);
console.log("Student's grade is: " + student_grade);

/**
array
 */

let scores = [10 , 20 , 30 , 40 , 50];

for (let i = 0; i < scores.length; i++) {
    //console.log('Score at index ' + i + 'is' + scores[i]);
    console.log(`Score at index ${i} is ${scores[i]}`);
}

//scores.forEach(function(s)) => {
    console.log('score: ' , s)


//score = score.map(s) => {
    return s + 2;


score[0] = scores[0] + 2;    
 
score.forEach((s) => {
    console.log('new score: ' , s)
})

let score = [10 , 20 , 30 , 40 , 50];

let newScore = []

for (let index = 0; index < scores.length; index++) {
    console.log('score: ' , scores[index])
}
//let newScore = scores.filter((s) => {
    return s >= 30;
//})

newScore.forEach((ns) => {
 console.log('new score: ' , ns)
})

/**
object + function
 */

let students = [
    {
        name: "aa",
        score: '50',
        grade: 'A'
    }
]
console.log("student: " , students[0]); 

let student = students.find((s) => {
    if (s.name === "bb") {
        return true;
    }

})

//let dublescore_student = students.map(s => {
    s.score = s.score * 2
    return s;

//console.log('student;' ,student)
//console.log(dublescore_student)

//let highscore_students = students.filter(s => {
 //   if (s.score >= 110) {
 //       return true;
//    }
//})

//console.log('highScore_student: ' , highScore_students