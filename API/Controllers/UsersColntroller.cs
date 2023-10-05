using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize] // only when a jwt token is passed
    public class UsersController : BaseApiController
    {
        public IUserRepository _userRepository { get; }
        public IMapper _mapper { get; }
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            // get the username from the token
            // var username = User.Identity.Name; // this is the same as the line below
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // get the user from the database
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null) return NotFound();

            // map the memberUpdateDTO to the user
            _mapper.Map(memberUpdateDTO, user);

            // update the user
            _userRepository.Update(user);

            // save the changes to the database
            if (await _userRepository.SaveAllAsync()) return NoContent(); // returns 204 without content

            // if the changes were not saved, return an error
            return BadRequest("Failed to update user");
        }
    }
}