using StudentManagementSystem.Backend.Models;

namespace StudentManagementSystem.Backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User> CreateAsync(User user);
        Task<bool> UsernameExistsAsync(string username);
    }
}
