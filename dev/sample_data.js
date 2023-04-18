// @Todo Update this with GCP project creds

// Source
let googleSheetSource =   {
    SourceId: 1,
    SourceType: "GoogleSheets",
    ClientId: "dbqiubdqeufb1324iow78",
    ClientSecret: "1djkn3o4boqfndwjf0983hwdbuw",
    RefreshToken: "1djkn3o4boqfndwjf0983hwdbuw"
}

let mySQLSource =   {
    SourceId: 1,
    SourceType: "MySQL",
    Host: "127.0.0.1",
    Port : 3306,
    DBName: "Test",
    User: "XXXX",
    Pass: "XXXX"
}

// Destination
let googleSheetDestination =   {
    DestinationId: 1,
    DestinationType: "GoogleSheets",
    ClientId: "dbqiubdqeufb1324iow78",
    ClientSecret: "1djkn3o4boqfndwjf0983hwdbuw",
    RefreshToken: "1djkn3o4boqfndwjf0983hwdbuw"
}

let mySQLDestination =   {
    DestinationId: 1,
    DestinationType: "MySQL",
    Host: "127.0.0.1",
    Port : 3306,
    DBName: "Test",
    User: "XXXX",
    Pass: "XXXX"
}

// Connection
let connection = {
    ConnectionId: 1,
    SourceId: 1,
    DestinationId: 1,
    Frequency: "Daily",
    LastSync: "2023-04-17T12:00:00Z",
    IsEnabled: true
}