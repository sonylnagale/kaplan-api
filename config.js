const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyB4K0OIoJ3QL5a1i3LenwdBDYq31czTr8w",
  authDomain: "kaplan-fb52d.firebaseapp.com",
  databaseURL: "https://kaplan-fb52d.firebaseio.com",
  projectId: "kaplan-fb52d",
  storageBucket: "",
  messagingSenderId: "251134431793"
};

const db = firebase.initializeApp(config).database();

module.exports = {
	name: 'assignments-api',
  version: '2.0.0',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 8081,
	base_url: process.env.BASE_URL || 'http://localhost:8081',
	db: db,
};
