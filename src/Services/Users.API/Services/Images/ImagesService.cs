// using System.Drawing;
using SixLabors.Fonts;
using Color = SixLabors.ImageSharp.Color;
using PointF = SixLabors.ImageSharp.PointF;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.PixelFormats;

namespace Users.API.Services.Images;

public class ImagesService
{
    
    public ImagesService()
    {
    }
    
    public IFormFile GenerateDpWithInitials(string firstName, string lastName)
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
    }
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