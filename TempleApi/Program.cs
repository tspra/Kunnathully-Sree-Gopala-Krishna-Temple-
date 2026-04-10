using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TempleApi.Data;
using TempleApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

var defaultOrigins = new[]
{
    "http://localhost:4200",
    "https://kunnathully-sree-gopalakrishna-temple.netlify.app"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("TempleFrontend", policy =>
    {
        var origins = allowedOrigins.Length > 0
            ? allowedOrigins
            : defaultOrigins;

        if (origins.Any(origin => origin == "*"))
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
            return;
        }

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<TempleContentDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("TempleContent")
        ?? "Data Source=temple-content.db";

    if (connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)
        || connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
        || connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase)
        || connectionString.Contains("Username=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
        return;
    }

    options.UseSqlite(connectionString);
});

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "TempleApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "TempleWeb";
var jwtKey = builder.Configuration["Jwt:Key"] ?? "TempleApi_SuperSecret_Key_ChangeMe_2026";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();
builder.Services.AddHostedService<PastBookingsCleanupService>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TempleContentDbContext>();
    dbContext.Database.EnsureCreated();
    EnsureCompatibilityColumns(dbContext);
    TempleDataSeeder.Seed(dbContext);
}

static void EnsureCompatibilityColumns(TempleContentDbContext dbContext)
{
    if (dbContext.Database.IsNpgsql())
    {
        dbContext.Database.ExecuteSqlRaw("ALTER TABLE \"Events\" ADD COLUMN IF NOT EXISTS \"ImageUrl\" text NOT NULL DEFAULT '';");
        dbContext.Database.ExecuteSqlRaw("ALTER TABLE \"VisitInfos\" DROP COLUMN IF EXISTS \"VisitingHours\";");
        return;
    }

    if (dbContext.Database.IsSqlite())
    {
        try
        {
            dbContext.Database.ExecuteSqlRaw("ALTER TABLE \"Events\" ADD COLUMN \"ImageUrl\" TEXT NOT NULL DEFAULT '';");
        }
        catch
        {
            // Column already exists in existing SQLite database.
        }

        try
        {
            dbContext.Database.ExecuteSqlRaw("ALTER TABLE \"VisitInfos\" DROP COLUMN \"VisitingHours\";");
        }
        catch
        {
            // Column does not exist or SQLite engine does not support drop column.
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("TempleFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
