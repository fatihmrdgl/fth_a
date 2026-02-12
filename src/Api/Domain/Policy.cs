namespace MimCrm.Api.Domain;

public class Policy
{
    public Guid Id { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = default!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    public string Status { get; set; } = "Active"; // Active, Expired, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}