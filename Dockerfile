FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["TempleApi/TempleApi.csproj", "TempleApi/"]
RUN dotnet restore "TempleApi/TempleApi.csproj"
COPY . .
WORKDIR "/src/TempleApi"
RUN dotnet build -c Release -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000
ENTRYPOINT ["dotnet", "TempleApi.dll"]
