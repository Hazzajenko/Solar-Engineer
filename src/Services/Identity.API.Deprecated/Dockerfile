FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Services/Identity.API.Deprecated/Identity.API.Deprecated.csproj", "Services/Identity.API.Deprecated/"]
RUN dotnet restore "Services/Identity.API.Deprecated/Identity.API.Deprecated.csproj"
COPY . .
WORKDIR "/src/Services/Identity.API.Deprecated"
RUN dotnet build "Identity.API.Deprecated.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Identity.API.Deprecated.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Identity.API.Deprecated.dll"]
