// using System.Drawing;

using SkiaSharp;
// using Color = SixLabors.ImageSharp.Color;
// using PointF = SixLabors.ImageSharp.PointF;

namespace Users.API.Services.Images;

public class ImagesService
{
    public static byte[] GenerateProfilePicture(string initials, int size)
    {
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

    /*public static string GenerateProfilePicture(string initials, int size = 128, string backgroundColor = "#4caf50", string textColor = "#ffffff")
    {
        using var image = new Image<Rgba32>(new Configuration(), size, size);

        // Draw the background color
        image.Mutate(x => x
            .BackgroundColor(Color.ParseHex(backgroundColor))
            .DrawImage(image, 1.0f)
        );

        // FontFamily sansSerifFont = FontFamily.GenericSansSerif;

        FontFamily mySansSerifFont = new FontFamily();
        Font mySansSerif12 = new Font(mySansSerifFont, 12);
        // Draw the initials
        var font = new Font(FontFamily.GenericSansSerif, size / 2);
        var textGraphicsOptions = new TextGraphicsOptions()
        {
            TextOptions = new TextOptions()
            {
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            }
        };
        image.Mutate(x => x
            .DrawText(textGraphicsOptions, initials.ToUpper(), font, Color.FromHex(textColor), new PointF(size / 2, size / 2))
        );

        // Return the base64-encoded PNG image
        using var memoryStream = new MemoryStream();
        image.Save(memoryStream, new PngEncoder());
        return $"data:image/png;base64,{Convert.ToBase64String(memoryStream.ToArray())}";
    }*/

    /*public IFormFile GenerateDpWithInitials(string firstName, string lastName)
    {
        var width = 200;
        var height = 200;
        FontCollection collection = new();
        FontFamily family = collection.Add("/Data/Fonts/FiraCode-VF.ttf");
        Font font = family.CreateFont(12, FontStyle.Regular);
        using(Image<Rgba32> image = new(width, height)) 
        {
            image.Mutate(x => x.BackgroundColor(Rgba32.ParseHex("#FFFFFF")));
            TextOptions options = new(font)
            {
                Origin = new PointF(100, 100), // Set the rendering origin.
                TabWidth = 8, // A tab renders as 8 spaces wide
                WrappingLength = 100, // Greater than zero so we will word wrap at 100 pixels wide
                HorizontalAlignment = HorizontalAlignment.Right // Right align
            };

            IBrush brush = Brushes.Horizontal(Color.Red, Color.Blue);
            IPen pen = Pens.DashDot(Color.Green, 5);
            string text = "HJ";

// Draws the text with horizontal red and blue hatching with a dash dot pattern outline.
            image.Mutate(x=> x.DrawText(options, text, brush, pen));

        } 
        return null;
    }*/
    /*
    public MemoryStream GenerateDpWithInitials(string firstName, string lastName)
    {
        const int size = 150;
        const int quality = 75;

        Configuration.Default.AddImageFormat(new JpegFormat());

        using (var input = File.OpenRead(inputPath))
        {
            using (var output = File.OpenWrite(outputPath))
            {
                var image = new MediaTypeNames.Image(input)
                    .Resize(new ResizeOptions
                    {
                        Size = new Size(size, size),
                        Mode = ResizeMode.Max
                    });
                image.ExifProfile = null;
                image.Quality = quality;
                image.Save(output);
            }
        }
    }*/
}