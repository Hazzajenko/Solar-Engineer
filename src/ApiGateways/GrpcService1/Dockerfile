FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ApiGateways/GrpcService1/GrpcService1.csproj", "ApiGateways/GrpcService1/"]
RUN dotnet restore "ApiGateways/GrpcService1/GrpcService1.csproj"
COPY . .
WORKDIR "/src/ApiGateways/GrpcService1"
RUN dotnet build "GrpcService1.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GrpcService1.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GrpcService1.dll"]
