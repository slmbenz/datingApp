namespace API.SignalR
{
    // store the connected users in memory of the current Server. this solution isn't scalable. it's just for an app that runs on a single server.
    // best approach is to use a distributed cache like Redis.
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers = new();

        public Task UserConnected(string username, string connectionId)
        {
            // lock the dictionary to prevent multiple threads from accessing it at the same time.
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(username, new List<string> { connectionId });
                }
            }

            return Task.CompletedTask;
        }


        public Task UserDisconnected(string username, string connectionId)
        {
            lock (OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.CompletedTask;

                OnlineUsers[username].Remove(connectionId);
                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                }
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

    }

}