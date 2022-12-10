using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OnePanelResponse
{
    public PanelDto Panel { get; set; } = default!;
}

public class CreateManyPanelsResponse
{
    public int AmountOfCreates { get; set; }
}

public class ManyPanelsResponse
{
    public IEnumerable<PanelDto> Panels { get; init; } = Enumerable.Empty<PanelDto>();
}

public class ManyPanelsUpdatesResponse
{
    public int SuccessfulUpdates { get; set; }
    public int Errors { get; set; }
}

public class OnePanelDeleteResponse
{
    public string PanelId { get; set; }
}

public class ManyPanelsDeletesResponse
{
    public int SuccessfulDeletes { get; set; }
    public int Errors { get; set; }
}