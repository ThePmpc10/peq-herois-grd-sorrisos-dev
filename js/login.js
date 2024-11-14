document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificação simples de login
    if (username === 'cyberTeam' && password === 'cyberTeam99') {
        // Armazena a informação no sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        // Redireciona para a página principal
        window.location.href = 'index1.html';  // Redireciona para a página principal após login
    } else {
        // Exibe uma mensagem de erro
        document.getElementById('login-error').textContent = 'Usuário ou senha incorretos!';
    }
});
