using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace Infrastructure.Azure;

public static class AzureSecrets
{
    private const string JwtKey = "Jwt-Key";

    public static async Task<string> GetJwtKey()
    {
        return await GetSecret(JwtKey);
    }

    private static async Task<string> GetSecret(string secretName)
    {
        var keyVaultName = GetEnvironmentVariable("AZURE_KEY_VAULT_NAME");
        var vaultUri = new Uri($"https://{keyVaultName}.vault.azure.net");
        var credential = GetClientCertificateCredential();
        var client = new SecretClient(vaultUri, credential);
        var secret = await client.GetSecretAsync(secretName);
        return secret.Value.Value;
    }

    private static ClientCertificateCredential GetClientCertificateCredential()
    {
        var directoryTenantId = GetEnvironmentVariable("AZURE_AD_TENANT_ID");
        var applicationClientId = GetEnvironmentVariable("AZURE_AD_CLIENT_ID");
        var clientCertPath = GetEnvironmentVariable("AZURE_CLIENT_CERTIFICATE_PATH");
        return new ClientCertificateCredential(directoryTenantId, applicationClientId, clientCertPath);
    }
}