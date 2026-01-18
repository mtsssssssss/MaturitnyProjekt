var builder = DistributedApplication.CreateBuilder(args);



var username = builder.AddParameter("username", secret: true);
var password = builder.AddParameter("password", secret: true);

var database = builder.AddPostgres("MaturitnyProjektPostgresDb", username, password)
    .WithContainerName("MaturitnyProjektDatabase")
    .WithHostPort(9999)
    .WithDataVolume("MaturitnyProjektPostgresDbVolume")
    .WithContainerName("MaturitnyProjektPostgresDb")
    .WithPgAdmin(configureContainer =>
    {
        configureContainer.WithHostPort(8888);
        configureContainer.WithContainerName("MaturitnyProjektPgAdmin");
    })
    .AddDatabase("MaturitnyProjekt");

builder.AddProject<Projects.backend>("backend")
    .WithReference(database)
    .WaitFor(database);

builder.Build().Run();
