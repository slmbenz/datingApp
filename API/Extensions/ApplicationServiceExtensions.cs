using API.Data;
using API.Helpers;
using API.Interfaces;
using API.services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions // static classes' methods can be used without instantiated
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
            IConfiguration config)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>(); // used for https request used inside a controller. it needs to specify the Interface and its implementing class
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings")); // this is used to configure the CloudinarySettings class
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<ILikesRepository, LikesRepository>();

            return services;
        }
    }
}