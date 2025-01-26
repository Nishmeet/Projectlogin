

document.addEventListener('DOMContentLoaded', async function() {
    console.log("I am in dashboard.js");
  const userId = localStorage.getItem('userId');
  const message = localStorage.getItem('message')
  const quote=localStorage.getItem('quote')

  if (!userId) {
    window.location.href = 'index.html';  // Redirect to login page if no user is logged in
    return;
  }
  document.getElementById('greeting').textContent = message;
  document.getElementById('quote').textContent = quote;
  

});


        document.getElementById('logoutButton').addEventListener('click', function() {

            console.log('User logged out');
            localStorage.removeItem('userId');
            localStorage.removeItem('message');
            localStorage.removeItem('quote')
          window.location.href = 'index.html';  // Redirect to login page after logout

        });
