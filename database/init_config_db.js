db.createUser(
    {
        user : "user",
        pwd : "Password@123",
        roles : [
            {
                role : "dbAdmin",
                db : "config_db"
            },
            {
                role : "readWrite",
                db : "config_db"
            }
        ]   
    }
)