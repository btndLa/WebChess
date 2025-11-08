FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY WebChess.WebApi/*.csproj WebChess.WebApi/
COPY WebChess.DataAccess/*.csproj WebChess.DataAccess/
COPY WebChess.Shared/*.csproj WebChess.Shared/

RUN dotnet restore
COPY . .

RUN dotnet publish WebChess.WebApi/WebChess.WebApi.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 7280

ENTRYPOINT ["dotnet", "WebChess.dll"]
