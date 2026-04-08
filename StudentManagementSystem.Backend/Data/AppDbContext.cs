using Microsoft.EntityFrameworkCore;
using StudentManagementSystem.Backend.Models;

namespace StudentManagementSystem.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Course).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // Seed default admin user (password: Admin@123)
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin"
            });

            // Seed sample students
            modelBuilder.Entity<Student>().HasData(
                new Student { Id = 1, Name = "Aarav Shah", Email = "aarav@example.com", Age = 20, Course = "Computer Science", CreatedDate = new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc) },
                new Student { Id = 2, Name = "Priya Mehta", Email = "priya@example.com", Age = 22, Course = "Data Science", CreatedDate = new DateTime(2024, 2, 10, 0, 0, 0, DateTimeKind.Utc) },
                new Student { Id = 3, Name = "Rohan Desai", Email = "rohan@example.com", Age = 21, Course = "Mechanical Engineering", CreatedDate = new DateTime(2024, 3, 5, 0, 0, 0, DateTimeKind.Utc) }
            );
        }
    }
}
