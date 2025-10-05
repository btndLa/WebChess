using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using WebChess.DataAccess;
using WebChess.DataAccess.Config;
using WebChess.WebApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options => {
	options.Filters.Add(new ProducesAttribute("application/json"));
	})
	.AddJsonOptions(options => {
		options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
		options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
	});
	
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
	c.SwaggerDoc("v1", new OpenApiInfo {
		Title = "WebChess",
		Version = "v1",
		Description = "API for WebChess"
	});
	var xfile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xpath = Path.Combine(AppContext.BaseDirectory, xfile);
	c.IncludeXmlComments(xpath);
	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme() {
		Name = "Authorization",
		Type = SecuritySchemeType.ApiKey,
		Scheme = "Bearer",
		BearerFormat = "JWT",
		In = ParameterLocation.Header,
		Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
	});
	c.AddSecurityRequirement(new OpenApiSecurityRequirement {
	{
		new OpenApiSecurityScheme {
			Reference = new OpenApiReference {
				Type = ReferenceType.SecurityScheme,
				Id = "Bearer"
			}
		},
		Array.Empty<string>()
	}});
});
builder.Services.AddAutoMapper();

var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new ArgumentNullException(nameof(JwtSettings));
builder.Services.Configure<JwtSettings>(jwtSection);
builder.Services.AddAuthentication(options => {
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
	options.TokenValidationParameters = new TokenValidationParameters() {
		ValidAudience = jwtSettings.Audience,
		ValidIssuer = jwtSettings.Issuer,
		ClockSkew = TimeSpan.Zero,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
	};
});



builder.Services.AddDataAccess(builder.Configuration);

builder.Services.AddCors(options =>
   {
       options.AddDefaultPolicy(policy =>
       {
           policy.WithOrigins("http://localhost:5173")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
