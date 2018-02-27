# Todo list

### Install

- Install https://nodejs.org/en/
- Download archive from link provided
- Unzip file and cd into it
- run 'npm install'

### Run
'node app.js'

Visit http://localhost:8080 in your browser

### High level application requirements
1. Multiple users should be able to view the shared public todo list
2. Should be able to add items
3. Should be able to delete items
4. Should be able to edit items (Missing feature)
5. Must be able to deploy in docker (Missing feature)

### Tasks
1. Add missing requirement #4 to the application
2. Add sufficient test coverage to the application and update readme on howto run the tests
3. Add missing requirement #5 to the application (Dockerfile and update readme with instructions)

### Bonus
4. Display test coverage after tests are executed
5. Find and fix the XSS vulnerability in the application. Also make sure that it wont happen again by including a test.

> ### Notes
> - Update the code as needed and document what you have done in the readme below
> - Will be nice if you can git tag the tasks by number

### Solution

Changed the port number to 81
'http://localhost:81' 

### Task 1:
Updates:
- back-end  - Added a post handler for edits which will  replace the existing item's value with the new value.
- front-end - Added style sheets to make UI more user friendly and change updated via a basic form post.  

### Task 2:
To run tests:
- 'npm install'
- 'npm test'

Updates:
- Added tests to test the API's responses for all 4 request types ('/todo', '/todo/add', '/todo/delete/:id', '/todo/edit/:id').

### Task 3:
Instructions:
- Install Docker: https://docs.docker.com/engine/installation/.
- To build docker image: "docker build -t todo ."
- To run docker image: "docker run -p 81:81 -d todo"
- Navigate to 'http://localhost:81' to see the app running under docker.

Updates:
- Updated package.json to have the start script.
- Added the Dockerfile with instructions to run app.

### Task 4:
Instructions:
- 'npm install'
- 'npm test'

Updates:
- Added istanbul to add code coverage.
- Updated 'npm test' command to run tests and produce code coverage report.
- Added more tests to test all areas of app.js.
- Updated app.js to have better if checks inside of /todo/delete/:id and /todo/edit/:id to ensure that non-existant ToDos can't be removed or edited.

### Task 5:
Instructions:
- 'npm install'
- 'npm test'
- Enter '<script>alert("you have been hacked")</script>' into the ToDo list. No Popup should appear.
- Enter '<script>window.onload = function() {document.getElementById("newtodo").value = "You got hacked!";document.getElementById("new-submit").click();};</script>'.
The page should NOT add 'you have been hacked' to your ToDo list.
