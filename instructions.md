//Some info

/files:
app.js: starting js file
package.json: dependencies and other info

/Folders:
MV: models, views
Routes: rendering routes
public: resources
bin: binary executables

In views:
article: single article displaying page, link to edit and delete
edit: edit and update the article
error: error display
footer:
header:
index: homepage with all(default article collection
login: login with username and password
post: write a  new article
reg: registration with username, password, email
user: article collection of the specific user






Structure(can be drawn in a flow chart):
www in bin is the executable to start
www calls app.js

app.js arranges as follows:
packages,
middlewares,
mount routes,
error handlers


In routes, index.js calls the call parts like index.ejs
login.ejs, which in turn calls the header.ejs and footer.ejs to render at top and bottom respectively
