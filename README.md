# How to Run This Project

### Step 1: Create a `.env` File in the "server" Folder

### Step 2: Add Variables to the `.env` File
Add the following environment variables to your `.env` file:

- `DB_NAME`: (string) A name for your MySQL database.
- `DB_USER`: (string)The username you use to log into the MySQL shell.
- `DB_PASSWORD`: (string)The password you use, if you have one, to log into the MySQL shell.
- `JWT_SECRET`: (string) A secret key to encrypt your JWT tokens.

### Step 3: Install Project Dependencies
Open a terminal at the root level of the project and run:

```bash
npm install
```
### Step 4: Set Up the Database (You ideally should only need to do this step once. )
1. Log into your MySQL shell.
2. Run the schema file located in the "db" folder to set up the database structure. From the root directory of the project, use the following command:

```bash
source db/schema.sql
```
### Step 5: Start the Project
At the root level of the project, run the following command to start the development server:

```bash
npm run develop
```
### Step 6: Open the Application
Open a browser and navigate to: [http://localhost:3000](http://localhost:3000)
