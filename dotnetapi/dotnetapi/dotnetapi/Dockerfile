FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["./dotnetapi.csproj", "dotnetapi/"]
RUN dotnet restore "dotnetapi/dotnetapi.csproj"
COPY . .
WORKDIR "/src/dotnetapi"
RUN dotnet build "dotnetapi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dotnetapi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dotnetapi.dll"]
