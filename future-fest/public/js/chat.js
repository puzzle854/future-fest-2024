document.getElementById('send-btn').addEventListener('click', async function (event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input').value;

    if (!userInput.trim()) {
        return;
    }


    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div><strong>Você:</strong> ${userInput}</div>`;
    document.getElementById('user-input').value = '';


    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput })
        });

        const data = await response.json();

        if (response.ok) {
            chatBox.innerHTML += `<div><strong>FlowHelper:</strong> ${data.response}</div>`;
        } else {
            chatBox.innerHTML += `<div><strong>FlowHelper:</strong> Erro ao processar a requisição.</div>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Erro ao enviar a requisição:', error);
        chatBox.innerHTML += `<div><strong>FlowHelper:</strong> Ocorreu um erro na comunicação.</div>`;
    }
});
