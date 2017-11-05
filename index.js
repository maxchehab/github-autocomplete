const pathToRegexp = require('path-to-regexp');
const Github = require('github-api-node');

let github = new Github({apiURL: "https://api.github.com",username: '',
password: ''});

if(process.argv.length < 3){
    process.exit()
}

input = "/" + process.argv[2].split("//")[1];
let re = pathToRegexp("/github.com/:username/:foo?")
let keys = re.exec(input)
if(keys){
    let username = keys[1];
    
    let user = github.getUser();
    let promise = new Promise((resolve, reject) => {
        user.userRepos(username, (error, repos) => {
            if(error) reject(error);
            try{
                const output = repos.map(r => r.name);
                resolve(output);            
            }catch(error){
                reject(error);
            }
        })
    });
    
    promise.then((value) => {
        let output = "";
        value.map(v => output += "/" + process.argv[2].split("//")[0] + "/github.com/" + username + "/" + v + " ");
        console.log(output);
    }).catch((error) => {console.log(error)});
}