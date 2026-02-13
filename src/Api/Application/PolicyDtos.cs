namespace MimCrm.Api.Application;

using MimCrm.Api.Domain;

public record PolicyDto(Guid Id, string PolicyNumber, Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, PolicyStatus Status);
public record CreatePolicyRequest(Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, PolicyStatus Status);
public record UpdatePolicyRequest(Guid CustomerId, Guid ProductId, DateTime StartDate, DateTime EndDate, decimal Premium, PolicyStatus Status);
public record ReportPolicyDto(Guid Id, string PolicyNumber, Guid CustomerId, string CustomerName, Guid ProductId, string ProductName, DateTime StartDate, DateTime EndDate, decimal Premium, PolicyStatus Status);
