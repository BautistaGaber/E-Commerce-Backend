fetch('/api/users/current', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((response) => {
    if (response.status === 401) {
      window.location.replace('/views/login')
    } else {
      return response.json()
    }
  })