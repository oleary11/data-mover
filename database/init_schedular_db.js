db.createUser(
    {
        user : "user",
        pwd : "Password@123",
        roles : [
            {
                role : "dbAdmin",
                db : "schedular_db"
            },
            {
                role : "readWrite",
                db : "schedular_db"
            }
        ]   
    }
)