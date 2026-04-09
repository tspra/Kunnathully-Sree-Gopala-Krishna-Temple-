using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TempleApi.Data;
using TempleApi.Models;

namespace TempleApi.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController(TempleContentDbContext dbContext, IConfiguration configuration) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpPost("register")]
    public async Task<ActionResult<RegisterAccountResponse>> Register(
        RegisterAccountRequest request,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        var normalizedMobileNumber = NormalizeMobileNumber(request.MobileNumber);

        var duplicateExists = await dbContext.UserAccounts
            .AsNoTracking()
            .AnyAsync(account => account.MobileNumber == normalizedMobileNumber || account.Email == normalizedEmail, cancellationToken);

        if (duplicateExists)
        {
            return Conflict(new { message = "An account with this mobile number or email already exists." });
        }

        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = HashPassword(request.Password, salt);

        var account = new UserAccountEntity
        {
            Name = request.Name.Trim(),
            Address = request.Address.Trim(),
            Email = normalizedEmail,
            MobileNumber = normalizedMobileNumber,
            PasswordSalt = Convert.ToBase64String(salt),
            PasswordHash = Convert.ToBase64String(hash),
            Role = "Admin",
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.UserAccounts.Add(account);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(Register),
            new { id = account.Id },
            new RegisterAccountResponse(
                account.Id,
                account.Name,
                account.Email,
                account.MobileNumber,
                "Account created successfully."));
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var emailOrMobile = request.EmailOrMobile.Trim();
        var normalizedEmail = NormalizeEmail(emailOrMobile);
        var normalizedMobileNumber = NormalizeMobileNumber(emailOrMobile);

        var account = await dbContext.UserAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                item => item.Email == normalizedEmail || item.MobileNumber == normalizedMobileNumber,
                cancellationToken);

        if (account is null)
        {
            return Unauthorized(new { message = "Invalid email/mobile or password." });
        }

        var isValidPassword = VerifyPassword(request.Password, account.PasswordSalt, account.PasswordHash);
        if (!isValidPassword)
        {
            return Unauthorized(new { message = "Invalid email/mobile or password." });
        }

        var token = GenerateJwtToken(account);

        return Ok(new LoginResponse(
            account.Id,
            account.Name,
            account.Email,
            account.MobileNumber,
            account.Role,
            token.Token,
            token.ExpiresAtUtc,
            "Login successful."));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<LoginResponse>> Me(CancellationToken cancellationToken)
    {
        var accountIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(accountIdClaim, out var accountId))
        {
            return Unauthorized();
        }

        var account = await dbContext.UserAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == accountId, cancellationToken);

        if (account is null)
        {
            return Unauthorized();
        }

        return Ok(new LoginResponse(
            account.Id,
            account.Name,
            account.Email,
            account.MobileNumber,
            account.Role,
            string.Empty,
            DateTime.UtcNow,
            "User session is active."));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword(
        ChangePasswordRequest request,
        CancellationToken cancellationToken)
    {
        var accountIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(accountIdClaim, out var accountId))
        {
            return Unauthorized();
        }

        var account = await dbContext.UserAccounts
            .FirstOrDefaultAsync(item => item.Id == accountId, cancellationToken);

        if (account is null)
        {
            return Unauthorized();
        }

        if (!VerifyPassword(request.CurrentPassword, account.PasswordSalt, account.PasswordHash))
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = HashPassword(request.NewPassword, salt);
        account.PasswordSalt = Convert.ToBase64String(salt);
        account.PasswordHash = Convert.ToBase64String(hash);

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Password changed successfully." });
    }

    private static byte[] HashPassword(string password, byte[] salt)
    {
        return Rfc2898DeriveBytes.Pbkdf2(password, salt, 100_000, HashAlgorithmName.SHA256, 32);
    }

    private static bool VerifyPassword(string password, string saltBase64, string hashBase64)
    {
        var salt = Convert.FromBase64String(saltBase64);
        var expectedHash = Convert.FromBase64String(hashBase64);
        var actualHash = HashPassword(password, salt);
        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }

    private static string NormalizeMobileNumber(string mobileNumber)
    {
        return mobileNumber.Trim();
    }

    private (string Token, DateTime ExpiresAtUtc) GenerateJwtToken(UserAccountEntity account)
    {
        var issuer = configuration["Jwt:Issuer"] ?? "TempleApi";
        var audience = configuration["Jwt:Audience"] ?? "TempleWeb";
        var key = configuration["Jwt:Key"] ?? "TempleApi_SuperSecret_Key_ChangeMe_2026";

        var expiresAtUtc = DateTime.UtcNow.AddHours(8);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new(ClaimTypes.Name, account.Name),
            new(ClaimTypes.Email, account.Email),
            new("mobile", account.MobileNumber),
            new(ClaimTypes.Role, account.Role)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        return (token, expiresAtUtc);
    }
}