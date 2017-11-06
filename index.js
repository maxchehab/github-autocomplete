#!/usr/bin/env node
const pathToRegexp = require("path-to-regexp");
const Github = require("github-api-node");
const ReadLine = require("readline");
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  process.exit();
}

if (process.argv[2] === "setup") {
  const readline = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.question(
    "This tool requires a GitHub access token.\nYou can create one here: https://github.com/settings/tokens/new\nToken: ",
    token => {
      fs.writeFileSync(path.resolve(__dirname, "token"), token, {
        encoding: "utf8",
        flag: "w"
      });

      let bashrcPath = path.resolve(home(), ".bashrc");

      let bashrcRead = fs.readFileSync(bashrcPath, "utf8");
      let autocompleteFunc = fs.readFileSync(
        path.resolve(__dirname, "bashrc"),
        "utf8"
      );

      if (bashrcRead.indexOf(autocompleteFunc) === -1) {
        fs.appendFileSync(bashrcPath, "\n" + autocompleteFunc);
      }
      console.log("Thank you! Please restart this bash session.");
      readline.close();
    }
  );
} else {
  let github = new Github({
    apiURL: "https://api.github.com",
    token: fs.readFileSync(path.resolve(__dirname, "token"), "utf8"),
    auth: "oauth"
  });
  input = "/" + process.argv[2].split("//")[1];
  let re = pathToRegexp("/github.com/:username/:foo?");
  let keys = re.exec(input);
  if (keys) {
    let username = keys[1];
    let getRepos = new Promise((resolve, reject) => {
      let user = github.getUser();
      user.userRepos(username, (error, repos) => {
        if (error) reject(error);
        try {
          const output = repos.map(r => r.name);
          resolve(output);
        } catch (error) {
          reject(error);
        }
      });
    });

    getRepos
      .then(value => {
        let output = "";
        value.map(
          v =>
            (output +=
              process.argv[2].split("//")[0] +
              "//github.com/" +
              username +
              "/" +
              v +
              " ")
        );
        console.log(output);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

function home() {
  return process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
}
