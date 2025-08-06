// In a real application, this would be your API client.
// For now, we'll simulate an API call with a delay.

export const getUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Ahmad Rahman',
        role: 'Administrator',
        avatarUrl: 'https://i.pravatar.cc/40?u=admin',
      });
    }, 500); // 500ms delay to simulate network latency
  });
};
