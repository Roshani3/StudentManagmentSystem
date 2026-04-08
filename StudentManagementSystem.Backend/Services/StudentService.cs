using StudentManagementSystem.Backend.DTOs;
using StudentManagementSystem.Backend.Models;
using StudentManagementSystem.Backend.Repositories;

namespace StudentManagementSystem.Backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repository;
        private readonly ILogger<StudentService> _logger;

        public StudentService(IStudentRepository repository, ILogger<StudentService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync()
        {
            _logger.LogInformation("Service: Getting all students");
            var students = await _repository.GetAllAsync();
            return students.Select(MapToDto);
        }

        public async Task<StudentDto?> GetStudentByIdAsync(int id)
        {
            _logger.LogInformation("Service: Getting student by ID {Id}", id);
            var student = await _repository.GetByIdAsync(id);
            return student == null ? null : MapToDto(student);
        }

        public async Task<StudentDto> CreateStudentAsync(CreateStudentDto dto)
        {
            _logger.LogInformation("Service: Creating student {Name}", dto.Name);

            var existing = await _repository.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new InvalidOperationException($"A student with email '{dto.Email}' already exists.");

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Age = dto.Age,
                Course = dto.Course,
                CreatedDate = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(student);
            return MapToDto(created);
        }

        public async Task<StudentDto?> UpdateStudentAsync(int id, UpdateStudentDto dto)
        {
            _logger.LogInformation("Service: Updating student {Id}", id);

            var student = await _repository.GetByIdAsync(id);
            if (student == null) return null;

            // Check if email is taken by another student
            var emailOwner = await _repository.GetByEmailAsync(dto.Email);
            if (emailOwner != null && emailOwner.Id != id)
                throw new InvalidOperationException($"Email '{dto.Email}' is already used by another student.");

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.Age = dto.Age;
            student.Course = dto.Course;

            var updated = await _repository.UpdateAsync(student);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            _logger.LogInformation("Service: Deleting student {Id}", id);
            return await _repository.DeleteAsync(id);
        }

        private static StudentDto MapToDto(Student student) => new()
        {
            Id = student.Id,
            Name = student.Name,
            Email = student.Email,
            Age = student.Age,
            Course = student.Course,
            CreatedDate = student.CreatedDate
        };
    }
}
