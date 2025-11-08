FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln ./

COPY WebChess.WebAPI/*.csproj WebChess.WebAPI/
COPY WebChess.DataAccess/*.csproj WebChess.DataAccess/
COPY WebChess.Shared/*.csproj WebChess.Shared/

RUN dotnet restore
COPY . .

RUN dotnet publish WebChess.WebAPI/WebChess.WebAPI.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Expose the port your app runs on
EXPOSE 7280

# Start the app
ENTRYPOINT ["dotnet", "WebChess.dll"]
