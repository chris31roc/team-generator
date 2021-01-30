const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];

//Manager Prompt 
const addManager = () => {
    return new Promise((res) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Manager's name:",
                    name: "name",
                },
                {
                    type: "input",
                    message: "Manager's ID:",
                    name: "id",
                },
                {
                    type: "input",
                    message: "Manager's email:",
                    name: "email",
                    //validate email
                    default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" Enter a valid email address! ")
                    return false;
                    }
                  }  
                },
                {
                    type: "input",
                    message: "Manager's office number:",
                    name: "officeNumber",
                },
            //add manager's info into team array     
            ]).then(responses => {
                const manager = new Manager(responses.name, responses.id, responses.email, responses.officeNumber);
                team.push(manager);
                res();
            });
    });
}
//Prompt for adding Engineer or Intern input
const addEmployee = () => {
    return new Promise((resolve) => {
        inquirer.prompt([
            {
                type: "list",
                message: "Choose Employee you would like to add:",
                name: "role",
                choices: [
                    "Engineer",
                    "Intern",
                    {
                        name: "No more employees to add",
                        value: false
                    }
                ]
            },
            {
                message: "Engineer's name:",
                name: "name",
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Intern's name:",
                name: "name",
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Engineer's ID:",
                name: "id",
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Intern's ID:",
                name: "id",
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Engineer's email address:",
                name: "email",
                //validate email
                default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" Enter a valid email address! ")
                    return false;
                    }
                  },  
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Intern's email address:",
                name: "email",
                //validate email
                default: () => {},
                    validate: function (email) {
                    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                     if (valid) {
                    return true;
                    } else {
                    console.log(" Enter a valid email address! ")
                    return false;
                    }
                  }, 
                when: ({ role }) => role === "Intern"
            },
            {
                message: "Engineer's GitHub username:",
                name: "github",
                when: ({ role }) => role === "Engineer"
            },
            {
                message: "Intern's School name:",
                name: "school",
                when: ({ role }) => role === "Intern"
            }
        //add Engineer/Intern info into team array     
        ]).then(responses => {
            if (responses.role) {
                switch (responses.role) {
                    case "Engineer":
                        const engineer = new Engineer(responses.name, responses.id, responses.email, responses.github);
                        team.push(engineer);
                        break;
                    case "Intern":
                        const intern = new Intern(responses.name, responses.id, responses.email, responses.school);
                        team.push(intern);
                        break;
                }
                return addEmployee().then(() => resolve());
            } else {
                return resolve();
            }
        })
    })
}

//calling Manager's and employee's prompt functions
addManager().then(() => {
    return addEmployee();
//calling render function to export team array information into html template   
}).then(() => {
    const templateHTML = render(team)
    generatePage(templateHTML);
}).catch((err) => {
    console.log(err);
});

//function to generate html page in output folder
const generatePage = (htmlPage) => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, htmlPage, "utf-8", (err) => {
        if(err) throw err;
        console.log("Your team profile page is being generated!");
    });
}