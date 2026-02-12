using System.Security.Cryptography;

namespace MimCrm.Api.Infrastructure;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 10000;

    public string Hash(string password)
    {
        using var algo = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256);
        var salt = algo.Salt;
        var key = algo.GetBytes(KeySize);
        return Convert.ToBase64String(salt.Concat(key).ToArray());
    }

    public bool Verify(string password, string hash)
    {
        var bytes = Convert.FromBase64String(hash);
        var salt = bytes.Take(SaltSize).ToArray();
        var key = bytes.Skip(SaltSize).Take(KeySize).ToArray();

        using var algo = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        var keyToCheck = algo.GetBytes(KeySize);
        return keyToCheck.SequenceEqual(key);
    }
}