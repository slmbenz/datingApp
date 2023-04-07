using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        // DbSet represents Table in the DB it create a table named Users with AppUser properties as columns
        public DbSet<AppUser> Users { get; set; }
    }
}