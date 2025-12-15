var builder = DistributedApplication.CreateBuilder(args);

var database = builder.AddPostgres("MaturitnyProjektPostgresDb")
    .WithHostPort(9999)
    .WithDataVolume("MaturitnyProjektPostgresDbVolume")
    .WithContainerName("MaturitnyProjektPostgresDb")
    .WithPgAdmin()
    .AddDatabase("MaturitnyProjekt");

builder.AddProject<Projects.backend>("backend")
    .WithReference(database)
    .WaitFor(database);

builder.Build().Run();
