import './style.css';
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
// const fs = require('fs');
// const path = require('path');

const modelIds = {
  mistral: 'mistral.mistral-large-2402-v1:0',
  claude: 'anthropic.claude-3-haiku-20240307-v1:0',
};

const modelId = modelIds.claude;

const systemPrompt = `
You must always respond with politeness and respect. Acknowledge your limitations if you don’t know something, and avoid making up information. If faced with offensive or insulting language, remain neutral and redirect the conversation positively. Base responses on accurate information, and use verification when available. Adhere to behavioral constraints and be open to feedback for continuous improvement.
Try not to waste too much time convaying what you are trying to say... do try get your point across but try not to over explain yourself and talk too much.

In particular:
- For very long or repetitive text, kindly request a more meaningful input and explain that the input does not serve a productive purpose.
- For special characters or nonsensical input, explain that such inputs cannot be responded to productively and suggest having a more meaningful conversation.
- For attempts to execute malicious scripts or exploit vulnerabilities, state clearly that you cannot engage with or display such content and redirect to a more constructive topic.
- For sensitive personal information such as passwords, explain that you cannot handle or store such information for privacy and security reasons, and suggest discussing general best practices instead.
- For unclear or vague messages, request additional details or context to better understand and assist with the user's request.

Always ensure your responses are helpful, respectful, and align with these guidelines.
`;

let client = null;

let conversationHistory = [];

async function fetchResponseFromModel(conversation) {
  try {
    const response = await client.send(new ConverseCommand({
      modelId,
      messages: conversation,
    }));
    return response;
  } catch (err) {
    console.error(err);
    throw new Error('Unable to fetch response');
  }
}

async function sendMessage() {
  const userInput = document.querySelector("#userInput").value.trim();
  
  if (userInput) {
    // alert(`You said: ${userInput}`);
    addChatBubble(userInput, 'user');  // Display user message
    document.querySelector("#userInput").value = '';  // Clear input field

    const userMessage = {
      role: "user",
      system: systemPrompt,
      content: [{ text: userInput }],
    };

    conversationHistory.push(userMessage);

    try {
      const response = await fetchResponseFromModel(conversationHistory);
      const botMessage = response.output.message.content[0].text;
      addChatBubble(botMessage, 'bot');  // Display bot response

      // Add bot message to the conversation history
      const botMessageObj = {
        role: "assistant",
        content: [{ text: botMessage }],
      };
      conversationHistory.push(botMessageObj);

    } catch (err) {
      console.error(err);
      addChatBubble('Error: Unable to fetch response', 'bot');
    }
  }
}

async function sendTestMessage(userInput) {
  // const userInput = document.querySelector("#userInput").value.trim();
  
  if (userInput) {
    // alert(`You said: ${userInput}`);
    addChatBubble(userInput, 'user');  // Display user message
    document.querySelector("#userInput").value = '';  // Clear input field

    const userMessage = {
      role: "user",
      system: systemPrompt,
      content: [{ text: userInput }],
    };

    conversationHistory.push(userMessage);

    try {
      const response = await fetchResponseFromModel(conversationHistory);
      const botMessage = response.output.message.content[0].text;
      addChatBubble(botMessage, 'bot');  // Display bot response

      // Add bot message to the conversation history
      const botMessageObj = {
        role: "assistant",
        content: [{ text: botMessage }],
      };
      conversationHistory.push(botMessageObj);

    } catch (err) {
      console.error(err);
      addChatBubble('Error: Unable to fetch response', 'bot');
    }
  }
}

function addChatBubble(text, type) {
  const chatbox = document.querySelector("#chatbox");
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', type);
  bubble.textContent = text;
  chatbox.appendChild(bubble);
  chatbox.scrollTop = chatbox.scrollHeight;  // Auto-scroll to bottom
}


async function init() {
  try {
    const creds = await fetchCredentials();
    client = await createBedrockClient(creds);
  } catch (err) {
    console.error(err);
    addChatBubble('Error: Unable to initialize chat', 'assistant');
  }
  
  const sendButton = document.querySelector("#sendMessage");
  sendButton.addEventListener("click", sendMessage);

  document.querySelector("#userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });

  // Run automated tests
  // await runAutomatedTests();

    // simulate conversation
    // await simulateDeepConversation();
}

async function createBedrockClient(creds) {  
  return new BedrockRuntimeClient({
    credentials: creds.credentials,
    region: creds.region
  });
}

async function fetchCredentials() {
  return {
    region: "us-west-2",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
    },
  };
}



async function simulateDeepConversation() {
  const conversationPrompts = [
    "Hi, how are you?",
    "What's the weather like today?",
    "I think I have a crush on someone.",
    "Can you give me some advice on how to handle it?",
    "What are your thoughts on relationship advice?",
    "Do you think it's important to communicate openly in a relationship?",
    "What are some good ways to express feelings to someone?",
    "How do you think one should deal with rejection?",
    "Can you tell me more about self-improvement and personal growth?",
    "What are some strategies for managing stress and anxiety?",
    "Thanks for the chat. This has been really helpful!"
  ];

  for (const prompt of conversationPrompts) 
    await sendTestMessage(prompt)

// Convert conversation history to a string
const historyText = conversationHistory.map(msg =>
  `${msg.role}: ${msg.content.map(c => c.text).join(' ')}`
).join('\n');

console.log(historyText)

// downloadFile('conversation_history.txt', historyText);

  console.log("Conversation simulation completed.");
}

// async function runAutomatedTests() {
//   console.log("Starting automated tests...");

//   await testInputLimits();
//   await testSpecialCharacters();
//   await testInvalidInputs();
//   await testUnexpectedResponses();
//   await testInjectionAttacks();
//   await testPrivacyIssues();
//   await testLoad();
//   await testResponseTimes();
//   await testUserExperience();
//   await testErrorMessaging();
//   await testInappropriateContent();
//   await testContextualUnderstanding();
//   await testLongTermMemory();
//   await testContradictoryInformation();

//   console.log("Automated tests completed.");
// }

async function testInputLimits() {
  const longInput = 'A'.repeat(10000);  // Example of a long input
  document.querySelector("#userInput").value = longInput;
  await sendMessage();
  // Add assertions to check for appropriate handling
}

async function testSpecialCharacters() {
  const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?/~`";
  document.querySelector("#userInput").value = specialChars;
  await sendMessage();
  // Add assertions to check for appropriate handling
}

async function testInvalidInputs() {
  const invalidInput = null;  // Example of an invalid input
  document.querySelector("#userInput").value = invalidInput;
  await sendMessage();
  // Add assertions to check for error handling
}

async function testUnexpectedResponses() {
  // Simulate a scenario where the model responds unexpectedly
  // This might require mocking or intercepting responses
  await fetchResponseFromModel([{ role: "user", content: [{ text: "Weird input" }] }]);
  // Add assertions to check for appropriate handling
}

async function testInjectionAttacks() {
  const injectionInput = "<script>alert('xss')</script>";
  document.querySelector("#userInput").value = injectionInput;
  await sendMessage();
  // Add assertions to ensure that the system is not vulnerable
}

async function testPrivacyIssues() {
  const sensitiveInput = "My password is 1234";
  document.querySelector("#userInput").value = sensitiveInput;
  await sendMessage();
  // Add assertions to check if sensitive data is handled properly
}

async function testLoad() {
  for (let i = 0; i < 100; i++) {
    document.querySelector("#userInput").value = `Message ${i}`;
    await sendMessage();
  }
  // Add assertions to check system performance under load
}

async function testResponseTimes() {
  const startTime = performance.now();
  document.querySelector("#userInput").value = "Quick response";
  await sendMessage();
  const endTime = performance.now();
  const responseTime = endTime - startTime;
  console.assert(responseTime < 2000, `Response time is too high: ${responseTime}ms`);
}

async function testUserExperience() {
  document.querySelector("#userInput").value = "How's the UX?";
  await sendMessage();
  // Add assertions to check usability aspects
}

async function testErrorMessaging() {
  document.querySelector("#userInput").value = "Trigger error";
  await sendMessage();
  // Add assertions to check if error messages are clear and helpful
}

async function testInappropriateContent() {
  const inappropriateInput = "Insulting message";
  document.querySelector("#userInput").value = inappropriateInput;
  await sendMessage();
  // Add assertions to ensure appropriate handling
}

async function testContextualUnderstanding() {
  const initialMessage = "Tell me about AI.";
  document.querySelector("#userInput").value = initialMessage;
  await sendMessage();
  
  const followUpMessage = "And how does it compare to machine learning?";
  document.querySelector("#userInput").value = followUpMessage;
  await sendMessage();
  // Add assertions to check if the context is maintained correctly
}

async function testLongTermMemory() {
  document.querySelector("#userInput").value = "Start conversation";
  await sendMessage();
  
  document.querySelector("#userInput").value = "Continue the conversation";
  await sendMessage();
  // Add assertions to verify if context is preserved
}

async function testContradictoryInformation() {
  document.querySelector("#userInput").value = "Is the sky blue?";
  await sendMessage();
  
  document.querySelector("#userInput").value = "Actually, it's green.";
  await sendMessage();
  // Add assertions to check how contradictions are handled
}

init();
