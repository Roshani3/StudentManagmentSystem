using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagementSystem.Backend.DTOs;
using StudentManagementSystem.Backend.Services;

namespace StudentManagementSystem.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(IStudentService studentService, ILogger<StudentsController> logger)
        {
            _studentService = studentService;
            _logger = logger;
        }

        /// <summary>
        /// Get all students
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<StudentDto>>), 200)]
        public async Task<IActionResult> GetAll()
        {
            _logger.LogInformation("GET /api/students called");
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(ApiResponse<IEnumerable<StudentDto>>.SuccessResponse(students, "Students retrieved successfully"));
        }

        /// <summary>
        /// Get a student by ID
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<StudentDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("GET /api/students/{Id} called", id);
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null)
                return NotFound(ApiResponse<StudentDto>.FailureResponse($"Student with ID {id} not found"));

            return Ok(ApiResponse<StudentDto>.SuccessResponse(student, "Student retrieved successfully"));
        }

        /// <summary>
        /// Create a new student
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<StudentDto>), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] CreateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed: " + string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))));

            _logger.LogInformation("POST /api/students called for {Name}", dto.Name);
            var created = await _studentService.CreateStudentAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ApiResponse<StudentDto>.SuccessResponse(created, "Student created successfully"));
        }

        /// <summary>
        /// Update an existing student
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<StudentDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateStudentDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed"));

            _logger.LogInformation("PUT /api/students/{Id} called", id);
            var updated = await _studentService.UpdateStudentAsync(id, dto);
            if (updated == null)
                return NotFound(ApiResponse<StudentDto>.FailureResponse($"Student with ID {id} not found"));

            return Ok(ApiResponse<StudentDto>.SuccessResponse(updated, "Student updated successfully"));
        }

        /// <summary>
        /// Delete a student
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("DELETE /api/students/{Id} called", id);
            var deleted = await _studentService.DeleteStudentAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<bool>.FailureResponse($"Student with ID {id} not found"));

            return Ok(ApiResponse<bool>.SuccessResponse(true, "Student deleted successfully"));
        }
    }
}
