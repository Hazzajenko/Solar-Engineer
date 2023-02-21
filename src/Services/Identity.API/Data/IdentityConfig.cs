using Duende.IdentityServer;
using Duende.IdentityServer.Models;
using IdentityModel;
using Infrastructure.Authentication;

namespace Identity.API.Data;

public static class IdentityConfig
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new List<IdentityResource>
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResources.Phone(),
            new IdentityResources.Address(),
            new(Constants.StandardScopes.Roles, new List<string> { "role" })
            /*new ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"),
            new ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"),
            new ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"),*/
            // new IdentityResources.Phone(),
            // new IdentityResources.Address(), /*new("info", new List<string>
            // {
            //     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
            //     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
            //     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            // }),*/
            /*new(Constants.StandardScopes.UsersApi, new List<string>
            {
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            })*/
        };


    public static IEnumerable<ApiScope> ApiScopes =>
        new List<ApiScope>
        {
            // new(IdentityServerConstants.StandardScopes.OpenId),
            // new(IdentityServerConstants.StandardScopes.Profile),
            new(Constants.StandardScopes.UsersApi)
            {
                Enabled = true,
                ShowInDiscoveryDocument = true,

                UserClaims =
                {
                    JwtClaimTypes.Subject,
                    JwtClaimTypes.Id,
                    // Constants.ScopeToClaimsMapping[IdentityServerConstants.StandardScopes.Profile].ToList(),
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                }
            },
            new(Constants.StandardScopes.MessagesApi),
            new("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"),
            new("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname")
            // new("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"),
            /*new()
            {
                Name = "user_id",
                DisplayName = "User Id",
                UserClaims = { JwtClaimTypes.Id }
            },
            // new IdentityResources.OpenId(),
            new()
            {
                Name = "user_id",
                DisplayName = "User Id",
                UserClaims = { JwtClaimTypes.Id }
            },
            new()
            {
                Name = "toto_api",
                DisplayName = "Api of Toto",
                UserClaims = { JwtClaimTypes.Email }
            }*/
        };


    public static IList<ApiResource> ApiResources =>
        new List<ApiResource>
        {
            new(Constants.StandardScopes.UsersApi, "Users Api")
            {
                Scopes =
                {
                    new string(IdentityServerConstants.StandardScopes.OpenId),
                    new string(IdentityServerConstants.StandardScopes.Profile),
                    Constants.StandardScopes.UsersApi
                },

                UserClaims =
                {
                    JwtClaimTypes.Subject,
                    JwtClaimTypes.Id,
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                }
            },
            new(Constants.StandardScopes.MessagesApi)
            // new("toto_api")
        };

    public static IEnumerable<Client> Clients =>
        new List<Client>
        {
            new()
            {
                ClientId = "m2m.client",
                ClientName = "Client Credentials Client",

                AlwaysSendClientClaims = true,
                // AlwaysIncludeUserClaimsInIdToken = true
                // AllowedGrantTypes = GrantTypes.ClientCredentials,
                ClientSecrets = { new Secret("secret".Sha256()) },
                RequireConsent = false,
                AlwaysIncludeUserClaimsInIdToken = true,

                Claims =
                {
                    new ClientClaim("dog_id", "123")
                    /*// JwtClaimTypes.Subject,
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"*/
                },
                AllowedGrantTypes = CustomAllowedGrantTypes(),
                /*AllowedGrantTypes =
                {
                    
                    OidcConstants.GrantTypes.TokenExchange,
                    GrantTypes.ClientCredentials
                },*/
                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    /*new(IdentityServerConstants.StandardScopes.OpenId),
                    new(IdentityServerConstants.StandardScopes.Profile),
                    "openid", "profile", "toto_api", */"users-api.read", "users-api.write"
                    /*"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"*/
                }
            },
            new()
            {
                ClientId = "interactive",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                AlwaysSendClientClaims = true,
                // AlwaysIncludeUserClaimsInIdToken = true
                AlwaysIncludeUserClaimsInIdToken = true,
                RedirectUris = { "https://localhost:6004/signin-oidc" },
                FrontChannelLogoutUri = "https://localhost:6004/signout-oidc",
                PostLogoutRedirectUris = { "https://localhost:6004/signout-callback-oidc" },

                // AllowOfflineAccess = true,
                AllowedScopes = { "openid", "profile", "users-api", "users-api.read", "users-api.write" },
                RequirePkce = true,
                RequireConsent = false,
                AllowPlainTextPkce = false
            },
            new()
            {
                ClientId = "client",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.ClientCredentials,

                RedirectUris =
                {
                    "https://localhost:4200/signin-oidc",
                    "https://localhost:6006/signin-oidc",
                    "https://localhost:6005/signin-oidc",
                    "https://localhost:6004/signin-oidc",
                    "https://localhost:6003/signin-oidc"
                },

                PostLogoutRedirectUris =
                {
                    "https://localhost:4200/signout-callback-oidc",
                    "https://localhost:6006/signout-callback-oidc",
                    "https://localhost:6005/signout-callback-oidc",
                    "https://localhost:6004/signout-callback-oidc",
                    "https://localhost:6003/signout-callback-oidc"
                },

                AllowedScopes =
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            },
            new()
            {
                ClientId = "web",
                ClientSecrets = { new Secret("secret".Sha256()) },

                AllowedGrantTypes = GrantTypes.Code,

                RedirectUris = { "https://localhost:5002/signin-oidc" },

                PostLogoutRedirectUris = { "https://localhost:5002/signout-callback-oidc" },

                AllowOfflineAccess = true,

                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    Constants.StandardScopes.UsersApi,
                    Constants.StandardScopes.MessagesApi
                }
            }
        };

    private static List<string> CustomAllowedGrantTypes()
    {
        var list = new List<string> { OidcConstants.GrantTypes.TokenExchange };
        list.AddRange(GrantTypes.ClientCredentials);
        return list;
    }
}