using Ardalis.SmartEnum;

namespace EventBus.Domain.ProjectsEvents;

public class ProjectEventType : SmartEnum<ProjectEventType>
{
    public static readonly ProjectEventType Created = new(nameof(Created), 1);
    public static readonly ProjectEventType Updated = new(nameof(Updated), 2);

    public static readonly ProjectEventType Deleted = new(nameof(Deleted), 3);

    // public static readonly ProjectEventType Invited = new InvitedToProject( new []{});
    public static readonly ProjectEventType Invited = new(nameof(Invited), 4);
    public static readonly ProjectEventType Removed = new(nameof(Removed), 5);


    public ProjectEventType(string name, int value)
        : base(name, value)
    {
    }

    /*private sealed class InvitedToProject: ProjectEventType
    {
        public InvitedToProject(IEnumerable<string> userIds) : base(nameof(Invited), 4)
        {
            UserIds = userIds;
        }
        
        public IEnumerable<string> UserIds { get; set; }



        /*public override bool CanTransitionTo(ReservationStatus next) =>
            next == ReservationStatus.Accepted || next == ReservationStatus.Cancelled;#1#
    }*/
}