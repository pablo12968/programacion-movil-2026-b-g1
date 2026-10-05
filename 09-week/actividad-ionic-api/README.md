# Actividad Ionic React + API
Architecture

The project is divided into an Express REST API and an Ionic React application. The API provides a GET "/api/eventos" endpoint that returns the events in JSON format. The API also provides a POST "/api/eventos" endpoint to create a new event. The Ionic React application consumes these endpoints using the "fetch" function. The application uses "useState" to manage the event list, form data, loading state, and error messages. When the user selects an event, the application navigates to a detail screen and displays its information.
