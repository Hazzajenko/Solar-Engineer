// using System.Drawing;

using SkiaSharp;

// using Color = SixLabors.ImageSharp.Color;
// using PointF = SixLabors.ImageSharp.PointF;

namespace Users.API.Services.Images;

public class ImagesService
{
    public static byte[] GenerateProfilePicture(string initials, int size)
    {
        // Image hi = Image.FromFile("C:\\Users\\james\\Desktop\\hi.png");
        // Create a new SKBitmap with the desired size and format

        var bitmap = new SKBitmap(size, size, SKColorType.Rgba8888, SKAlphaType.Premul);

        // Create a new SKCanvas to draw on the bitmap
        using (var canvas = new SKCanvas(bitmap))
        {
            // Clear the canvas with a background color
            canvas.Clear(SKColors.LightGray);

            // Set up a paint object with the desired text style
            using (var paint = new SKPaint())
            {
                paint.Typeface = SKTypeface.FromFamilyName("Arial", SKFontStyleWeight.Normal, SKFontStyleWidth.Normal,
                    SKFontStyleSlant.Upright);
                paint.TextSize = size / 2;
                paint.Color = SKColors.White;
                paint.IsAntialias = true;

                // Calculate the position of the text based on its size and the size of the bitmap
                var textBounds = new SKRect();
                paint.MeasureText(initials, ref textBounds);
                var x = (size - textBounds.Width) / 2;
                var y = (size + textBounds.Height) / 2;

                // Draw the text on the canvas
                canvas.DrawText(initials, x, y, paint);
            }
        }

        // Convert the bitmap to a byte array in PNG format
        using (var image = SKImage.FromBitmap(bitmap))
        using (var data = image.Encode(SKEncodedImageFormat.Png, 100))
        {
            return data.ToArray();
        }
    }
}