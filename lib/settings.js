
var MQ_EXCHANGE = 'simulator';
var MQ_TOPIC_GT_OBJECT = 'sim.gt';
var MQ_TOPIC_SIM_MANAGEMENT = 'sim.gt';
var MQ_TOPIC_SCENARIO_MANAGEMENT = 'sim.scenario';
var ENTITY_MSG_UPDATE = 'entity-update';
var ENTITY_MSG_REMOVE = 'entity-remove';
var CLEAR_PICTURE = 'clear-picture';
var LOAD_SCENARIO = 'load-scenario';
var START_SIMULATION = 'start-simulation';
var PAUSE_SIMULATION = 'pause-simulation';
var RESET_SIMULATION = 'reset-simulation';
var SCENARIO_LOADED = 'scenario-loaded';
var SIMULATION_STARTED = 'simulation-started';
var SIMULATION_PAUSED = 'simulation-paused';
var SIMULATION_RESET = 'simulation-reset';


module.exports = {
    storageserver: {
        hostname: '127.0.0.1',
        port: 8001,
        trackLibraryUrl: 'mongodb://localhost:27017/tracklibrary'
    },
    trackserver: {
        hostname: '127.0.0.1',
        port: 8000
    },
    terrainserver: {
        hostname: '127.0.0.1',
        port: 8888,
//    dbUrl: 'mongodb://localhost:27017/terrainsvr?socketTimeoutMS=36000000&connectTimeoutMS=3600000',
//    osmDBUrl: 'mongodb://localhost:27017/osm?socketTimeoutMS=3600000&connectTimeoutMS=3600000'
        dbUrl: 'mongodb://map.home.web:27017/terrainsvr?socketTimeoutMS=36000000&connectTimeoutMS=3600000',
        osmDBUrl: 'mongodb://map.home.web:27017/osm?socketTimeoutMS=3600000&connectTimeoutMS=3600000'
    },

    mqOptions: {
        exchange: MQ_EXCHANGE,
        topic_gt_object: MQ_TOPIC_GT_OBJECT,
        topic_sim_management: MQ_TOPIC_SIM_MANAGEMENT,
        topic_scenario_management: MQ_TOPIC_SCENARIO_MANAGEMENT,
        entity_msg_update: ENTITY_MSG_UPDATE,
        entity_msg_remove: ENTITY_MSG_REMOVE,
        clear_picture: CLEAR_PICTURE,
        load_scenario: LOAD_SCENARIO,
        start_simulation: START_SIMULATION,
        pause_simulation: PAUSE_SIMULATION,
        reset_simulation: RESET_SIMULATION,
        scenario_loaded: SCENARIO_LOADED,
        simulation_started: SIMULATION_STARTED,
        simulation_paused: SIMULATION_PAUSED,
        simulation_reset: SIMULATION_RESET
    }
};
