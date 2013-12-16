* Overview

I probably bit off more than I should have for this project.  I wanted to use it as an opportunity to work with unfamiliar tools and frameworks which I'd been interested in.  To that end, I chose to build the API with restify in node.js and the front end in Angular.js.  As I was comitted to writing tests for any code I generated, I also found myself having to learn two unfamiliar testing frameworks (Mocha and Karma).

In the end, I was able to finish the primary project requirements, some additional backend work, and a number of tests.  I was hoping to finish all the "extra credit," but I underestimated how much time it would take me to get up to speed with Angular and Karma.  If I had a full extra day to work on the project, I'm sure I could complete it.

* Setup

1. Clone the repo wherever you like.  Most internal paths are relative.  When they're not, all the bits and pieces should be smart enough to figure out by themselves where they live.

2. Copy the contents of the app directory to somewhere in your web server's document root.  I copied mine to a subdirectory called "mentor" right off my document root.

3. Start the API.  That should just be a matter of running the api/start script.  It assumes you've got node and npm installed.  It will fill in the rest of the dependencies by itself.

4. View the app in your web browser of choice (especially if it's Chrome, since that's where I developed it).

5. If your curious to see that everything works, run the tests/start script.  It'll download the Karma and Mocha test frameworks and run the included unit tests.

* To-do (things I wish I'd done, but didn't have time for)

1. Finish the template modification code.  The backend code is done, but I didn't get the chance to wire up the app to it.

2. Finish the template-add controller on the front end.  Again, the backend code is done and the route is active in the app, but there's no controller code.

3. Harden the API.  There's probably lots of ways it can be broken at the moment.  I need to spend more time staring at it, to find out where the holes are.

4. Make the app more frugal with its API calls.  Right now, every template switch causes an API invocation.  There's got to be a way to have that happen only when getting the next and prev templates.

