module.exports = {
    port: process.env.PORT || 3010,
    database: process.env.DB_NAME || "planning",
    db:  process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:5432/",
    driver: "postgres"
};

