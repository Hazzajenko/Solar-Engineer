FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Services/Projects.API/Projects.API.csproj", "Services/Projects.API/"]
RUN dotnet restore "Services/Projects.API/Projects.API.csproj"
COPY . .
WORKDIR "/src/Services/Projects.API"
RUN dotnet build "Projects.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Projects.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Projects.API.dll"]
