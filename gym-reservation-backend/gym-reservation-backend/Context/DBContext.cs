using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using gym_reservation_backend.Models;

namespace gym_reservation_backend.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> dbContextOptions) : base(dbContextOptions)
        {
            try
            {
                var database = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (database != null)
                {
                    if (!database.CanConnect())
                        database.Create();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<Classes> Classes { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<UserMenus> UserMenus { get; set; }
        public DbSet<SystemMenu> SystemMenus { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }

        public DbSet<MemberSubscription> MemberSubscriptions { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<ContactUs> ContactUs { get; set; }
        public DbSet<Notification> Notifications { get; set; }


        // Add this method right here, after your DbSet properties
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Class relationship
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Class)
                .WithMany(c => c.Reservations)
                .HasForeignKey(r => r.ClassId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Member relationship
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Member)
                .WithMany(m => m.Reservations)
                .HasForeignKey(r => r.MemberId)
                .OnDelete(DeleteBehavior.NoAction);

           
        }
    }
}