lethexa-trackdisplay
--------------------

This is a Track-display for the browser written in angularJS/nodeJS.
Tracks are provided via RabbitMQ to the webserver. Websockets are used
to dynamically update the tracks.

To show tracks on the display send json-objects to AMQP 
to topic 'sim.gt.object' on exchange 'simulator':

	{
            header: {
                type: 'entity-update'
            },
            data: {
		"firstctc":1456515394945,  // [ms]
		"lastctc":1456515394945,   // [ms]
		"trackId":211317180,       
		"lat":53.906445,           // Decimal degrees
		"lon":8.689741666666666,   // Decimal degrees
		"speed":16.7,              // [m/s]
		"course":5.88175957922089  // [rad]
            }
	}

To remove a track:

	{
            header: {
                type: 'entity-remove'
            },
            data: {
		"firstctc":1456515394945,  // [ms]
		"lastctc":1456515394945,   // [ms]
		"trackId":211317180,       
		"lat":53.906445,           // Decimal degrees
		"lon":8.689741666666666,   // Decimal degrees
		"speed":16.7,              // [m/s]
		"course":5.88175957922089  // [rad]
            }
	}

To clear all tracks:

	{
            header: {
                type: 'clear-picture'
            },
            data: {
            }
	}


For additional services (countrynames, photos, routes) to work you have to start the terrainsvr and mqstorage.


Installation
------------

	npm install
	bower install

Usage
-----

	npm start

Open browser at localhost:8000



License
-------

This application is published under MIT license.
