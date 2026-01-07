using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// CORS pre NextJS frontend
// https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-9.0
builder.Services.AddCors(opt =>
    opt.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); ;
    })
);

// pridanie Postgres databazy do DI
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MaturitnyProjekt")));

// pridanie mojich Servicov do DI
builder.Services.AddScoped<QuestionsService>();
builder.Services.AddScoped<SubjectsService>();
builder.Services.AddScoped<TestsService>();

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("");

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
}

// https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-9.0#middleware-order

app.UseHttpsRedirection();

app.UseRouting();

if (app.Environment.IsDevelopment()) { app.UseCors("frontend"); }
;

app.UseAuthorization();

app.MapControllers();

app.Run();

