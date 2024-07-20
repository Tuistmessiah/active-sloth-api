print("--- START: init script ---");

// Use the admin database to create the root user
db = db.getSiblingDB("admin");

// Check if the root user already exists
if (db.getUser("root") === null) {
  db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: "root", db: "admin" }],
  });
  print("Root user created.");
} else {
  print("Root user already exists.");
}

// Authenticate with the root user
db.auth("root", "example");

db = db.getSiblingDB(process.env.MONGO_DB);

db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_DB,
    },
  ],
});

db.createCollection("users");
db.createCollection("days");

print("--- END: init script ---");
