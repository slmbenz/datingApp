// Purpose: Interface for UnitOfWork class in API project.
namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        // IPhotoRepository PhotoRepository { get; }
        // IUnitOfWork UnitOfWork { get; }

        Task<bool> Complete();

        bool HasChanges();
    }
}