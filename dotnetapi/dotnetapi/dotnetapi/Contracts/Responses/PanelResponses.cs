using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OnePanelResponse
{
    public PanelDto Panel { get; set; } = default!;
}