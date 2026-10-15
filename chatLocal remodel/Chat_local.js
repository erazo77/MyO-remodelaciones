const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Función para mostrar el mensaje de bienvenida automático
function showWelcomeMessage() {
    const welcomeMessage = '¡Bienvenido a M&O Remodelaciones y Acabados! 🏗️\n\n' +
        'Somos tu aliado confiable en servicios de remodelación y construcción. Estamos aquí para ayudarte a hacer realidad tus proyectos.\n\n' +
        'Nuestros servicios incluyen:\n' +
        '📌 Remodelación de Apartamentos:\n' +
        '- Remodelación completa\n' +
        '- Reformas parciales\n' +
        '- Ampliaciones\n' +
        '- Cambios de distribución\n\n' +
        '📌 Servicios Especializados:\n' +
        '- Revoque y estuco\n' +
        '- Pintura y echape\n' +
        '- Plomería\n' +
        '- Electricidad\n' +
        '- Carpintería\n' +
        '- Acabado de techos\n\n' +
        '📌 Acabados:\n' +
        '- Pintura interior y exterior\n' +
        '- Instalación de pisos\n' +
        '- Instalación de cerámicas\n' +
        '- Acabados en madera\n' +
        '- Instalación de molduras\n' +
        '- Acabados decorativos\n\n' +
        '¿En qué servicio podemos ayudarte hoy?';

    // Mostrar el mensaje de bienvenida después de un breve retraso
    setTimeout(() => {
        addMessage('bot', welcomeMessage);
    }, 500);
}

// Mostrar el mensaje de bienvenida cuando se carga la página
window.addEventListener('load', showWelcomeMessage);

function addEmojiToInput(emoji) {
    userInput.value += emoji;
}

function sendMessage() {
    let userMessage = userInput.value.trim();
    if (userMessage !== '') {
        addMessage('user', userMessage);
        userInput.value = '';
        showTypingIndicator();
        setTimeout(() => handleResponse(userMessage), 1000);
    }
}

function handleResponse(message) {
    let response = '';
    message = message.toLowerCase();

    // Saludos y bienvenida
    if (message.includes('hola') || message.includes('buenas') || message.includes('buenos dias') || 
        message.includes('buenos días') || message.includes('buenas tardes') || message.includes('buenas noches')) {
        response = '¡Hola! 👋 Soy el asistente de M&O Remodelaciones y Acabados. ¿En qué puedo ayudarte hoy? Estamos especializados en remodelaciones y acabados para tu hogar.';
    }
    // Interés inicial
    else if (message.includes('si') || message.includes('sí') || 
        message.includes('me interesa') || message.includes('quiero') || 
        message.includes('adelante') || message.includes('proceder') ||
        message.includes('me gustaria') || message.includes('proceder') ||
        message.includes('ok') || message.includes('vale')) {
        response = '¡Me alegra mucho tu interés! 😊\n\n' +
            'Para poder ayudarte mejor, ¿te gustaría que te cuente cómo trabajamos? Así podrás conocer nuestro proceso y decidir si es lo que buscas.';
    }
    // Explicación del proceso
    else if (message.includes('como trabajan') || message.includes('cómo trabajan') || 
             message.includes('proceso') || message.includes('cuéntame') || 
             message.includes('cuentame')) {
        response = '¡Claro! Te explico cómo trabajamos:\n\n' +
            'Primero hacemos una visita técnica gratuita para conocer tu proyecto. En esta visita:\n' +
            '• Evaluamos el espacio\n' +
            '• Escuchamos tus necesidades\n' +
            '• Tomamos medidas\n' +
            '• Te damos recomendaciones\n\n' +
            'Después, te enviamos un presupuesto detallado y si estás de acuerdo, programamos el trabajo.\n\n' +
            '¿Te gustaría agendar una visita?';
    }
    // Agendar visita - Paso 1
    else if (message.includes('visita') || message.includes('agendar')) {
        response = '¡Perfecto! Para agendar la visita necesito algunos datos:\n\n' +
            '¿En qué zona está tu proyecto? Así puedo coordinar mejor la visita con nuestro equipo.';
    }
    // Agendar visita - Paso 2
    else if (message.includes('zona') || message.includes('ubicación') || message.includes('ubicacion')) {
        response = 'Gracias por la información. ¿Qué día te vendría mejor para la visita?\n\n' +
            'Estamos disponibles:\n' +
            '• Lunes a Viernes: 8:00 AM - 5:00 PM\n' +
            '• Sábados: 8:00 AM - 12:00 PM';
    }
    // Agendar visita - Paso 3
    else if (message.includes('lunes') || message.includes('martes') || message.includes('miercoles') || 
             message.includes('miércoles') || message.includes('jueves') || message.includes('viernes') || 
             message.includes('sabado') || message.includes('sábado')) {
        response = 'Excelente elección. Para confirmar la visita, ¿podrías compartirme tu nombre y un número de contacto? Así nuestro equipo se comunicará contigo para confirmar la hora exacta.';
    }
    // Información sobre servicios
    else if (message.includes('servicio') || message.includes('servicios')) {
        response = 'En M&O Remodelaciones y Acabados nos especializamos en varios servicios. ¿Qué te gustaría hacer en tu hogar? Por ejemplo:\n\n' +
            '• ¿Remodelar algún espacio?\n' +
            '• ¿Cambiar los acabados?\n' +
            '• ¿Hacer reparaciones?\n\n' +
            'Cuéntame qué tienes en mente y te ayudo a encontrar la mejor solución.';
    }
    // Información sobre precios
    else if (message.includes('precio') || message.includes('precios') || message.includes('cuesta') || 
             message.includes('valor') || message.includes('costo')) {
        response = 'Para darte un precio preciso, necesito saber un poco más sobre tu proyecto. ¿Podrías contarme qué te gustaría hacer específicamente? Así puedo darte un rango de precios más acertado.';
    }
    // Información sobre contrato y presupuesto
    else if (message.includes('contrato') || message.includes('acuerdo') || message.includes('presupuesto')) {
        response = 'El presupuesto y contrato son muy sencillos:\n\n' +
            '1. Te enviamos un presupuesto detallado con todos los trabajos\n' +
            '2. Si estás de acuerdo, firmamos un contrato que incluye:\n' +
            '   • Descripción del trabajo\n' +
            '   • Precios\n' +
            '   • Tiempos de ejecución\n' +
            '   • Garantías\n\n' +
            'El pago se divide en tres partes:\n' +
            '• 30% al iniciar\n' +
            '• 40% durante la obra\n' +
            '• 30% al finalizar\n\n' +
            '¿Te parece bien esta estructura?';
    }
    // Despedidas
    else if (message.includes('gracias') || message.includes('thank')) {
        response = '¡Gracias a ti por contactarnos! 😊\n\n' +
            'Si tienes más preguntas o necesitas algo más, no dudes en escribirme. Estoy aquí para ayudarte.';
    }
    else if (message.includes('adios') || message.includes('adiós') || message.includes('chao') || 
             message.includes('hasta luego') || message.includes('hasta pronto')) {
        response = '¡Hasta pronto! 👋\n\n' +
            'Recuerda que estamos aquí para ayudarte. Si necesitas algo más, no dudes en escribirnos. ¡Que tengas un excelente día!';
    }
    // Respuesta por defecto
    else {
        response = 'Entiendo que estás interesado en nuestros servicios. Para poder ayudarte mejor, ¿podrías contarme más específicamente qué te gustaría hacer en tu hogar?';
    }

    setTimeout(() => {
        hideTypingIndicator();
        addMessage('bot', response);
    }, 2000);
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('bot-message', 'typing-indicator');
    typingIndicator.textContent = 'Escribiendo...';
    typingIndicator.id = 'typing-indicator';
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Desplaza hacia abajo
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        chatContainer.removeChild(typingIndicator);
    }
}

function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
    
    const messageContent = document.createElement('span');
    messageContent.textContent = message;
    messageElement.appendChild(messageContent);
    
    const messageMeta = document.createElement('div');
    messageMeta.classList.add('message-meta');
    
    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = getCurrentTime();
    
    messageMeta.appendChild(timestamp);
    
    // Solo agrega los chulitos a los mensajes del usuario
    if (sender === 'user') {
        const checkmarks = document.createElement('span');
        checkmarks.classList.add('checkmarks');
        checkmarks.innerHTML = '✓✓'; // Aquí puedes cambiar a los chulitos azules si quieres
        messageMeta.appendChild(checkmarks);
    }
    
    messageElement.appendChild(messageMeta);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Desplaza hacia abajo
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

// Vincula el botón de envío con la función sendMessage
sendButton.addEventListener('click', sendMessage);

// Permite enviar el mensaje presionando la tecla Enter
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Previene el comportamiento predeterminado del Enter en el input
        sendMessage();
    }
});

