using AutoMapper;
using WebChess.DataAccess.Models;
using WebChess.Shared.Models;
namespace WebChess.WebApi.Infrastructure {
	public class MappingProfile : Profile{

		public MappingProfile() {

			CreateMap<UserRequestDto, User>(MemberList.Source)
			.ForSourceMember(src => src.Password, opt => opt.DoNotValidate())
			.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));

			CreateMap<User, UserResponseDto>(MemberList.Destination);
		}

	}
}
