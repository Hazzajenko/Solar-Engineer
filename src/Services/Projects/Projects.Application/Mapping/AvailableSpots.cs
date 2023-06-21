/*
namespace Projects.Application.Mapping;

public enum DiagonalDirection
{
    BottomLeftToTopRight,
    TopLeftToBottomRight,
    TopRightToBottomLeft,
    BottomRightToTopLeft
}

public class TransformedPoint
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class EntityBase
{
    // Define the properties of the EntityBase class here
}

public class SpotInBox
{
    public bool Vacant { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
}

public class Size
{
    public double Width { get; set; }
    public double Height { get; set; }
}

public class EntityBounds
{
    public double Left { get; set; }
    public double Top { get; set; }
    public double Right { get; set; }
    public double Bottom { get; set; }
    public double CenterX { get; set; }
    public double CenterY { get; set; }
}

public class PanelClass
{
    public List<SpotInBox> GetAllAvailableEntitySpotsBetweenTwoPoints(
        TransformedPoint point1,
        TransformedPoint point2,
        List<EntityBase> entities
    )
    {
        var distanceX = point1.X - point2.X;
        var distanceY = point1.Y - point2.Y;
        var entitySize = new Size { Width = 18, Height = 23 };

        var widthWithMidSpacing = entitySize.Width + 2;
        var heightWithMidSpacing = entitySize.Height + 2;
        var entitiesInX = Math.Floor(distanceX / widthWithMidSpacing);
        var entitiesInY = Math.Floor(distanceY / heightWithMidSpacing);
        var diagonalDirection = GetDiagonalDirectionFromTwoPoints(point1, point2);
        if (diagonalDirection == null)
            return new List<SpotInBox>();

        var startingPoint = GetStartingSpotForCreationBox(diagonalDirection.Value, entitySize);
        var twoPointBounds = GetBoundsFromTwoPoints(point1, point2);

        var existingEntities = FilterEntitiesInsideBounds(twoPointBounds, entities);
        var widthIsPositive = entitiesInX > 0;
        var adjustedWidth = widthIsPositive ? -widthWithMidSpacing : widthWithMidSpacing;

        var heightIsPositive = entitiesInY > 0;
        var adjustedHeight = heightIsPositive ? -heightWithMidSpacing : heightWithMidSpacing;
        var spots = new List<SpotInBox>();
        for (var i = 0; i < Math.Abs(entitiesInX); i++)
        {
            for (var a = 0; a < Math.Abs(entitiesInY); a++)
            {
                var spot = new SpotInBox
                {
                    Vacant = true,
                    X = point1.X + startingPoint.X + i * adjustedWidth,
                    Y = point1.Y + startingPoint.Y + a * adjustedHeight
                };
                foreach (var entity in from entity in existingEntities let size = entitySize let firstSpot = new TransformedPoint
                         {
                             X = spot.X - size.Width / 2,
                             Y = spot.Y - size.Height / 2
                         } let secondSpot = new TransformedPoint
                         {
                             X = spot.X + size.Width + size.Width / 2,
                             Y = spot.Y + size.Width + size.Height / 2
                         } where IsEntityInsideTwoPoints(entity, firstSpot, secondSpot) select entity)
                {
                    spot.Vacant = false;
                }
                /*foreach (var entity in existingEntities)
                {
                    var size = entitySize;
                    // var size = GetEntitySize(entity); // GetEntitySize should be defined
                    var firstSpot = new TransformedPoint
                    {
                        X = spot.X - size.Width / 2,
                        Y = spot.Y - size.Height / 2
                    };
                    var secondSpot = new TransformedPoint
                    {
                        X = spot.X + size.Width + size.Width / 2,
                        Y = spot.Y + size.Width + size.Height / 2
                    };
                    if (IsEntityInsideTwoPoints(entity, firstSpot, secondSpot))
                    {
                        spot.Vacant = false;
                    }
                }#1#
                spots.Add(spot);
            }
        }
        return spots;
    }

    public DiagonalDirection? GetDiagonalDirectionFromTwoPoints(
        TransformedPoint start,
        TransformedPoint end
    )
    {
        // Implementation of GetDiagonalDirectionFromTwoPoints goes here
    }

    public TransformedPoint GetStartingSpotForCreationBox(DiagonalDirection direction, Size size)
    {
        // Implementation of GetStartingSpotForCreationBox goes here
    }

    public EntityBounds GetBoundsFromTwoPoints(TransformedPoint point1, TransformedPoint point2)
    {
        // Implementation of GetBoundsFromTwoPoints goes here
    }

    public List<EntityBase> FilterEntitiesInsideBounds(
        EntityBounds bounds,
        List<EntityBase> entities
    )
    {
        // Implementation of FilterEntitiesInsideBounds goes here
    }

    public bool IsEntityInsideTwoPoints(
        EntityBase entity,
        TransformedPoint point1,
        TransformedPoint point2
    )
    {
        // Implementation of IsEntityInsideTwoPoints goes here
    }
}
*/
