FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Services/Messages.API/Messages.API.csproj", "Services/Messages.API/"]
RUN dotnet restore "Services/Messages.API/Messages.API.csproj"
COPY . .
WORKDIR "/src/Services/Messages.API"
RUN dotnet build "Messages.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Messages.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Messages.API.dll"]
