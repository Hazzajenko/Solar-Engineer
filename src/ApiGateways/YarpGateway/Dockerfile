FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ApiGateways/YarpGateway/YarpGateway.csproj", "ApiGateways/YarpGateway/"]
RUN dotnet restore "ApiGateways/YarpGateway/YarpGateway.csproj"
COPY . .
WORKDIR "/src/ApiGateways/YarpGateway"
RUN dotnet build "YarpGateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "YarpGateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "YarpGateway.dll"]
