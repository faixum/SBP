export const login = async (username, password) => {
  const response = await fetch('/api-auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Django's CSRF token needs to be included in the headers
      // This is a simplified example. In a real app, you'd fetch the token first.
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
};

export const getUser = async () => {
  const response = await fetch('/api/user/');
  if (!response.ok) {
    // If not authenticated, redirect to login or handle error
    // For now, we'll throw an error
    throw new Error('Not authenticated');
  }
  const data = await response.json();
  // The backend returns 'username', but the frontend expects 'name' and 'role'.
  // We'll adapt the data here.
  return {
    name: data.username,
    role: data.is_staff ? 'Administrator' : 'User', // Example role logic
    avatarUrl: `https://i.pravatar.cc/40?u=${data.username}`,
  };
};

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
