namespace Users.API.Services.Images;

public class ImagesService
{
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