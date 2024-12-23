# Kinderly Day Care App

Simple, easy to use, web-based day care management system for registering kids and issuing report cards for parents.
The app allows for custom permission-based access, that allows external users like parents to log in and view their child/children
records.
The staff can register new children and check them in/out for the day. The staff can also enter report cards for the child for the specific day.
Staff and parents can view all the records of the children and filter them based on a provided date range.

## Targeted users and use cases
Day care admin (setup the day care system), Day care Staff (login, register or add a new child, view list, and fill in the report card), and parents (login, view records)

## Screenshots
[Kinderly Admin Dashboard](/docs/DashboardAdmin.png) <br />
[Kinderly Staff Dashboard](/docs/DashboardStaff.png) <br />
[Kinderly Parent Dashboard](/docs/DashboardParent.png) <br />
[Kinderly Staff Child Details](/docs/StaffChildDetails.png) <br />

### Tech Stack
- Django / Django REST Framework
- PostgreSQL
- JSONWebToken
- React
- CSS
- MaterialUI
- Axios

### Installation

1. Clone the repository
2. Backend:
- Root folder: `DayCareApp\backend`
- Install dependencies: `pip install -r requirements.txt`
- Run app: `python manage.py runserver`
3. Forntend:
- Root folder: `DayCareApp\frontend`
- Install dependencies: `npm install`
- Build app: `npm run build`
- Run preview: `npm run preview`
4. Testing - front and backend

## Main Features

- A web application that allows day care facility staff to keep a record of children, check them in/out, and issue report cards for parents.
- The app will require login - custom permission levels based on group membership.
    - Default administrator account has full access. Can create groups and permissions from the Settings menu.
    - Users with permission to edit users can register new admins, staff members, and external users like parents.
    - Users are allowed to change their bio or password. Admins can reset all users passwords.
    - Admin and staff users with permission to view/edit children can register/edit children.
    - Admin and staff users with permission to check in/out a child can perform the actions on the details page for the child.
    - Admin and staff users with permision to edit report cards can create/edit report cards for a child.
    - Parents can only log in to view child details and report cards for their child/children.

## Project management

 - **[Gdrive](https://drive.google.com/drive/u/0/folders/1dz7En8VuEC4wSh8wO3zWwWz8ttegZdW1)**<br />
- **[Our Team whiteboard for brainstorming](https://zoom.us/wb/doc/rBUG2fDGQYObdTIw-LNrAQ)**<br />
- **[Jira](https://chinguteam.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)**<br />
- **[Confluence](https://chinguteam.atlassian.net/wiki/spaces/SCRUM)**<br />
- **[Git Repo](https://github.com/chingu-voyages/v52-tier3-team-36)**<br />
- **[Design](https://whimsical.com/join/CdTaW6krn1wgZaE1f8hccN?invite=ymkugnf2)**<br />
- [Meeting](https://schej.it/home)<br />

## Live Demo
[Live demo](https://kinderly-frontend.onrender.com/) <br />
Demo admin username and password: testadmin <br />
Demo admin username and password: teststaff <br />
Demo admin username and password: testparent <br />
Notes: The app is deployed as a free instance on Render. The web server spins down after inactivity. Please allow a minute for the server to come back up.

## Our Team

- Heba Rezk, PO/Primary SM: [GitHub](https://github.com/hebarezk) / [Linkedin](https://www.linkedin.com/in/hebarezk/)
- Valerie Johnson, Secondary SM: [LinkedIn](https://www.linkedin/in/valeriemichellejohnson) , [Email](valeriejohnsonprofessional@gmail.com) / [GitHub](https://github.com/johnsonval)
- Rumen Ivanov, Developer: [GitHub](https://github.com/rumenji) / [LinkedIn](https://www.linkedin.com/in/rumen-ivanov-it/)
- Sunny, Developer: [Linkedin](https://www.linkedin.com/in/sunnymaster/) , [GitHub](https://github.com/Sunny-Master) , [Email](master.codeworks@gmail.com) 
