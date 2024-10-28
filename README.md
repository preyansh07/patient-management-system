# Welcome to Patient Management System API!

## Setup
1. I have used Docker to run this application, so you will need to install and setup Docker in your local system first.
2. Once Docker is up and running, execute the following Docker command to run the API:
	 
        docker-compose up -d --build
3. Import `Patient Management System.postman_collection.json` file present in the root directory into Postman to test the API endpoints.

**Note: I am checking in .env file with both JWT and mongodb URL without authentication to make it easier to test. In reality, we must not push such sensitive information in version control.**

## API specification
### Registration and Login
1. Go to *auth* folder in Postman collection and register a user with the help of *Register User* endpoint.
2. Once a user is created, execute the *Login User* endpoint to get the auth token in response.
3. Copy the **token** in Parent collection's Authorization tab with *Bearer Token* Auth Type.
4. Run patient records APIs to create, get, update, and delete patient records with appropriate access control.
5. Run appointment APIs to create, get, update, and delete appointments with right permissions.

### Further Improvements
1. We can improve appointment scheduling with finer control on appointment time and avoiding conflict in appointments for both doctors and patients.
2. We should secure MongoDB with authentication

## Summary

This setup provides:

1.  **Access-Controlled CRUD Operations** for both patient records and appointments.
2.  **Role-Based Filtering and Permissions**:
    -   **Patients** can only access their own records and both access and modify their own appointments.
    -   **Doctors** can access and update their assigned patient records and appointments.
    -   **Admins** have unrestricted access to both patient records and appointments.

The APIs are now structured to enforce strict access control based on user roles, enhancing security and ensuring each user can only perform actions allowed by their role.