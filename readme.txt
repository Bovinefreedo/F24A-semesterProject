Getting data from CSV to NEON TECH,

To not clutter the git project to much, the project does not include the node modules.
To get the node modules for the project localy, you must enter these commands
    
    npm init -y
    npm install dotenv express pg nodemon
    npm install csvtojson
    npm install body-parser

Then you need to create a file named .env the DATABASE_URL is esentialy the password to the database and will be provided to trusted contributers

    PORT=4000
    DATABASE_URL= 