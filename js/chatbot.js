function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");

    if (userInput.value.trim() === "") return;  // Impede enviar mensagens vazias

    // Exibir mensagem do usuário com horário
    const userMessage = document.createElement("div");
    userMessage.className = "message user-message";
    userMessage.innerHTML = `
        <span>${userInput.value}</span>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    chatMessages.appendChild(userMessage);

    // Enviar mensagem para o backend e exibir resposta com horário
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerHTML = `
        <span>Processando...</span>
        <span class="message-time">${getCurrentTime()}</span>
    `;
    chatMessages.appendChild(botMessage);

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput.value })
        });

        const data = await response.json();
        botMessage.innerHTML = `
            <span>${data.reply}</span>
            <span class="message-time">${getCurrentTime()}</span>
        `;

        // Desabilitar o chat se `disableChat` for verdadeiro na resposta
        if (data.disableChat) {
            userInput.disabled = true;  // Desativa o campo de entrada
            document.querySelector(".chat-footer i").style.pointerEvents = "none";  // Desativa o botão de envio
            document.querySelector(".chat-footer i").style.opacity = "0.5";  // Estiliza o botão de envio para indicar desabilitado
        }

    } catch (error) {
        botMessage.innerHTML = `
            <span>Erro ao se comunicar com o servidor.</span>
            <span class="message-time">${getCurrentTime()}</span>
        `;
    }

    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const chatIcon = document.getElementById("chatbot-icon");
    const chatbotWindow = document.getElementById("chatbot-window");

    // Esconde o chat ao carregar a página
    chatbotWindow.style.display = "none";

    // Ouvinte de evento para o Enter
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Adiciona a classe de animação de alerta ao ícone do chat
    chatIcon.classList.add("chatbot-alert");

    // Remove a classe de alerta após 5 segundos
    setTimeout(() => {
        chatIcon.classList.remove("chatbot-alert");
    }, 2500); // 2500ms = 2.5 segundos
});

let initialMessageDisplayed = false;

function toggleChatbot() {
    const chatbotWindow = document.getElementById("chatbot-window");

    // Alterna entre mostrar e esconder a janela do chat
    if (chatbotWindow.style.display === "none") {
        chatbotWindow.style.display = "flex"; // Abre o chat

        // Adiciona a mensagem inicial do bot se não foi exibida antes
        if (!initialMessageDisplayed) {
            const chatMessages = document.getElementById("chat-messages");

            const botMessage = document.createElement("div");
            botMessage.className = "message bot-message";
            botMessage.innerHTML = `
        <span>Olá, como posso ajudar?</span>
        <span class="message-time">${getCurrentTime()}</span>
      `;

            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll até a última mensagem
            initialMessageDisplayed = true; // Define a flag para não mostrar novamente
        }
    } else {
        chatbotWindow.style.display = "none"; // Fecha o chat
    }
}

